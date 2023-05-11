import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler
import sklearn.metrics as sm
from sklearn.model_selection import train_test_split

dataset = pd.read_csv('Our_Data.csv')
X = dataset.drop(['DHI'], axis=1)
Y = pd.DataFrame(dataset['DHI'])

testset = pd.read_csv('test.csv')

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.33, random_state=42)
model = pickle.load(open('bestsvr.pkl', 'rb'))
Y_pred = model.predict(X_test)
Y_pred2 = model.predict(testset)

print(Y_pred2)

# print("Mean absolute error =", round(sm.mean_absolute_error(Y_test, Y_pred), 2)) 
# print("Mean squared error =", round(sm.mean_squared_error(Y_test, Y_pred), 2)) 
# print("Median absolute error =", round(sm.median_absolute_error(Y_test, Y_pred), 2)) 
# print("Explain variance score =", round(sm.explained_variance_score(Y_test, Y_pred), 2)) 
# print("R2 score =", round(sm.r2_score(Y_test, Y_pred), 2)) 

