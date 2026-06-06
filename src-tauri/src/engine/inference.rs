//! محرك الاستدلال السببي - خفيف للموبايل
//! DAG + Backdoor Criterion + do-calculus ATE

use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet, VecDeque};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum VarType { Binary, Continuous }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Variable {
    pub name: String,
    pub var_type: VarType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CPD {
    pub parents: Vec<String>,
    pub mean_effect: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CausalModel {
    pub variables: HashMap<String, Variable>,
    pub edges: HashMap<String, Vec<String>>,
    pub parents: HashMap<String, Vec<String>>,
    pub cpds: HashMap<String, CPD>,
}

impl CausalModel {
    fn has_path(&self, start: &str, target: &str) -> bool {
        let mut visited = HashSet::new();
        let mut stack = vec![start.to_string()];
        while let Some(node) = stack.pop() {
            if node == target { return true; }
            if visited.insert(node.clone()) {
                if let Some(children) = self.edges.get(&node) {
                    stack.extend(children.clone());
                }
            }
        }
        false
    }

    fn has_path_avoiding(&self, start: &str, target: &str, forbidden: &str) -> bool {
        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();
        queue.push_back(start.to_string());
        visited.insert(start.to_string());
        while let Some(node) = queue.pop_front() {
            if node == target { return true; }
            if node == forbidden { continue; }
            if let Some(children) = self.edges.get(&node) {
                for child in children {
                    if!visited.contains(child) {
                        visited.insert(child.clone());
                        queue.push_back(child.clone());
                    }
                }
            }
        }
        false
    }

    fn find_backdoor_set(&self, x: &str, y: &str) -> Vec<String> {
        let mut confounders = HashSet::new();
        if let Some(parents_of_x) = self.parents.get(x) {
            for p in parents_of_x {
                if self.has_path_avoiding(p, y, x) {
                    confounders.insert(p.clone());
                }
            }
        }
        confounders.into_iter().collect()
    }

    pub fn intervene(&self, treatment: &str, outcome: &str) -> InterventionResult {
        let backdoor_vars = self.find_backdoor_set(treatment, outcome);
        let warning = if backdoor_vars.is_empty() {
            Some("تحذير: مسارات خلفية مفتوحة. أضف المتغيرات المشوشة".to_string())
        } else {
            None
        };

        let effect_per_unit = self.cpds.get(outcome)
           .and_then(|cpd| if cpd.parents.contains(&treatment.to_string()) { Some(cpd.mean_effect) } else { None })
           .unwrap_or(0.0);

        InterventionResult {
            treatment: treatment.to_string(),
            outcome: outcome.to_string(),
            ate: effect_per_unit,
            warning,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InterventionResult {
    pub treatment: String,
    pub outcome: String,
    pub ate: f64,
    pub warning: Option<String>,
}
