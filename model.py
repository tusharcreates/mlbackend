import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import StandardScaler
import sklearn.metrics as sm
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split

dataset = pd.read_csv('Our_Data.csv')
testset = pd.read_csv('test.csv')
X = dataset.drop(['DHI'], axis=1)
Y = pd.DataFrame(dataset['DHI'])

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.1, random_state=42)

regressor = SVR(kernel = 'rbf', C=100, gamma=0.1)
regressor.fit(X_train, Y_train)

Y_pred = regressor.predict(X_test)
Y_pred2 = regressor.predict(testset)
print(Y_pred2)

