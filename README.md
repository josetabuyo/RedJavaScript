# RedJavaScript
Red neuronal en javascript

Está publicada en el link sig:
http://josetabuyo.github.io/RedJavaScript/


Pretendo hacer un modelo conexionista que cumpla con las observaciones del modelo
biológico en cuanto a las tareas que este puede realizar y en el método para conseguirlo.
Me baso también en otros modelos de red neuronal y en trabajos científicos acerca del
cerebro, de la conciencia, etc.

Al basarme en la biología los objetos fundamentales que hay son los siguientes:

 - Red
 - Neurona
 - Axon
 - Dendrita
 - Sinapsis


 Con los siguientes coeficientes reguladores de la actividad:

 - COEF_UMBRAL_SPIKE:
    Determina cuando se produce el "spike" en el axón en función de la tensión superficial de la neurona.
 - COEF_AXON_ANCHO_PULSO:
    Determina cuanto tiempo (medido en pasos de la red) dura el axón en 1 y cuanto en 0.
 - COEF_TENSION_DECAIMIENTO:
    Determina el coeficiente decaimiento de la tensión superficial de la neurona.
 - COEF_DENDRITA_DECAIMIENTO:
	Determina el decaimiento de la tensión de la dendrita.
 - COEF_SINAPSIS_ENTRENAMIENTO:
	Determina el coeficiente de entrenamiento.
 - COEF_UMBRAL_SINAPSIS_PESO:
	Determina el valor mínimo del peso de una sinapsis para que exista.
 


No hay operaciones que se hagan por fuera de las conexiones, sin embargo se pudo lograr la exclusión y la
habilidad de hacer clúster.
Se pudo lograr el Pandemonio descripto por Daniel Dennet, la dinámica del conjunto de demonios. La campana
descripta por Kohonen al observar la retina de los gatos coincide con el demonio.
Al pandemonio se lo conoce también como maquina Joyceana.
En un pandemonio, no hay un espectador que determina la actividad, ésta es producto de la interacción entre
las partes.
Cada "joroba" cada conjunto de neuronas activadas y lindantes sería un demonio, que compite con el resto
para activarse al mismo tiempo que es activado en base a la actividad del resto. Competencia y cooperación
entre demonios es lo que sucede realmente.


Para lograr mi cometido necesité crear una interfaz gráfica y un test válido.
El test propuesto es que la Red pueda recibir entradas de un autómata y enviar las salidas correctas para
que el autómata pueda "sobrevivir" en el mundo virtual modelado.


El proyecto está en construcción..

Ya se logró crear una red, conectar las neuronas entre si, conectar las entradas a el "ojo" del autómata.


Que falta a hoy:

En cuanto a la red:
 Todavía no resuelve el entrenamiento, ni las salidas conectadas al movimiento del autómata.
En cuento al contexto:
 Un test más realista se requiere, con más estímulos de los que actualmente hay. Del tipo "buenos" y
 "malos" para el autómata.
En cuanto a la interfaz:
 Pretendo poder pintar y conectar las neuronas con el mouse y poder construir Redes diseñadas.


Consejos para usar la interfaz: 

Cuando estás en Pause podés apretar con el botón de la derecha sobre una neurona y ver sus sinapsis.
Los botones tienen tooltip, leelos!.
Si jugás con los coeficientes siempre podés actualizar la página y vuelve todo a la normalidad.
Se recomienda usar Google Chrome y apretar F12 para ver la consola.
Desde ahí puede inspeccionarse la red tipeando "red;", por ejemplo.


Saludos!


JoZbuyo


