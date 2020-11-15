# Importar bibliotecas
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt

# Carregar os dados
df = pd.read_csv('housing2.csv')
df.head()

# Serparar entre Feature(X) e Target(y)
y = df['MEDV']
df.drop('MEDV', axis='columns', inplace=True)
X = df

# Tranformar em array
X = np.array(X)
y = np.array(y)

# Reshape do array y (target)
y = y.reshape(-1,1)

# Verificar Score (R2) do modelo
print(clf.score(X,y))
print(r2_score(y, y_pred))

# Verificar valores do Slope
clf.coef_

# Verificar valore do Bias
clf.intercept_

# Tabela com os coeficientes (slope) dos atributos
coef_table = pd.DataFrame(list(df.columns)).copy()
coef_table.insert(len(coef_table.columns),"Coefs",clf.coef_.transpose())
print(coef_table)

# Predição do valor y para um registro (no caso o Reg 1)
x_pred = X[1]
x_pred = x_pred.reshape(1,-1)
x_pred
print(clf.predict(x_pred))

# Grafico y reais x y preditos
plt.scatter(y,y_pred, color='black')
plt.plot(y,y, color='blue', linewidth=3)
plt.xlabel("Valores Reais")
plt.ylabel("Valores Preditos")
plt.show()

# Grafico da Função linear para cada atributo do dataset
atr = "NOX"
plt.scatter(y=y, x=df[atr], color='black', s=50, alpha=.5)
X_plot = np.linspace(min(df[atr]), max(df[atr]), len(df[atr]))
plt.plot(X_plot, X_plot*clf.coef_[0,4] + clf.intercept_, color='r') # clf.coef_[0,X]: alterar X de acordo com o atributo
plt.title('Reta de regressão')
plt.ylabel('Variavel Resposta')
plt.xlabel('Atributo ' + atr)
plt.show()

