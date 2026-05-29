import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.svm import SVC
from sklearn.cluster import KMeans
import joblib

# Create directory to save models if it doesn't exist
script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, "models")
os.makedirs(models_dir, exist_ok=True)

# 1. Prepare/Generate synthetic training dataset
data = {
    'coding_score':      [95, 90, 85, 88, 75, 60, 55, 80, 40, 30, 92, 70, 50, 85, 65, 45, 78, 82, 58, 90, 35, 80, 72, 68, 84],
    'aptitude_score':    [90, 85, 80, 75, 80, 70, 65, 60, 50, 40, 94, 75, 55, 88, 60, 50, 82, 78, 62, 90, 45, 85, 70, 62, 80],
    'communication_score': [85, 80, 75, 90, 85, 80, 70, 50, 60, 50, 88, 78, 60, 90, 85, 40, 80, 85, 65, 95, 40, 70, 75, 80, 88],
    'cgpa':              [9.5, 9.0, 8.5, 8.9, 8.2, 7.5, 7.0, 7.2, 6.5, 6.0, 9.6, 8.0, 6.8, 9.1, 7.8, 6.2, 8.4, 8.5, 7.0, 9.2, 5.8, 8.3, 7.9, 7.6, 8.6],
    'attendance':        [95, 90, 88, 92, 85, 80, 82, 75, 70, 60, 98, 85, 72, 90, 80, 65, 86, 88, 78, 94, 70, 82, 84, 81, 89]
}

# Labels definitions matching linear output, eligiblities and specialization class (SVM: Specialist vs Generalist)
# We map normalizations from features
df = pd.DataFrame(data)

# Features normalization
X = df.copy()
X['coding_score'] /= 100.0
X['aptitude_score'] /= 100.0
X['communication_score'] /= 100.0
X['cgpa'] /= 10.0
X['attendance'] /= 100.0

# Multiple Linear Regression Label: Overall Placement index (0 - 100)
# Mathematically constructed continuous weighted target
y_lr = (df['coding_score']*0.35 + df['aptitude_score']*0.20 + df['communication_score']*0.15 + df['cgpa']*2.0 + df['attendance']*0.10)
# bound to 100
y_lr = np.clip(y_lr, 0, 100)

# Binary Logistic Regression Label: Fit for early recruitment pool (1: Eligible, 0: Under review)
# Placement eligibility criteria based on sum index threshold of 75
y_logreg = (y_lr >= 75).astype(int)
if len(np.unique(y_logreg)) < 2:
    y_logreg = (y_lr >= np.median(y_lr)).astype(int)

# SVM Classifier Class: High specialization field fit (1: Tech heavy specialist, 0: Gen products generalist)
# If coding score is higher than communication and aptitude, label as 1, else 0
y_svm = (df['coding_score'] > df['communication_score']).astype(int)
if len(np.unique(y_svm)) < 2:
    y_svm = (df['coding_score'] > df['coding_score'].median()).astype(int)

# 2. Train and Save Models
print("--- Training Scikit-Learn Models ---")

# A. Linear Regression
lr_model = LinearRegression()
lr_model.fit(X, y_lr)
print("Linear Regression Fitted. R^2 score:", lr_model.score(X, y_lr))
joblib.dump(lr_model, os.path.join(models_dir, "linear_regression.joblib"))

# B. Logistic Regression
logreg_model = LogisticRegression(solver='liblinear')
logreg_model.fit(X, y_logreg)
print("Logistic Regression Fitted. Intercept:", logreg_model.intercept_)
joblib.dump(logreg_model, os.path.join(models_dir, "logistic_regression.joblib"))

# C. Support Vector Classifier (SVM)
svm_model = SVC(kernel='linear', probability=True)
svm_model.fit(X, y_svm)
print("SVM Classifier Fitted. Support Vector Indices:", svm_model.support_)
joblib.dump(svm_model, os.path.join(models_dir, "svm_classifier.joblib"))

# D. KMeans Clustering
# Unsupervised Clustering over Coding, Aptitude and Communication Skills into 3 distinct bands (Centroid-based)
kmeans_features = X[['coding_score', 'aptitude_score', 'communication_score']]
kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans_model.fit(kmeans_features)
print("K-Means Fitted. Cluster Centers:\n", kmeans_model.cluster_centers_)
joblib.dump(kmeans_model, os.path.join(models_dir, "kmeans_clustering.joblib"))

# Save sample dataset to csv file for inspection
df.to_csv(os.path.join(script_dir, "sample_student_data.csv"), index=False)
print("Saved sample_student_data.csv configuration and all models dump.")
