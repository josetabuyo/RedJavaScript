# RedJavaScript
Red neuronal conexionista en javascript
Ver la red funcionando con el test acá!!:
http://josetabuyo.github.io/RedJavaScript/

Se pretende hacer un modelo conexionista que cumpla con las observaciones del modelo biológico en cuanto a las tareas que este puede realizar y en el método para conseguirlo.
Me baso en diversos trabajos de distintas áreas para lograr el modelo que mejor satisfaga la unión de las perspectivas, de las observaciones, tanto en el humano como en el resto de los seres cerebrados de la biología.

Al basarme en la biología los objetos fundamentales que hay son los siguientes:
 - Red
 - Neurona
 - Axon
 - Dendrita
 - Sinapsis

 Con los siguientes coeficientes reguladores de la actividad:
 - COEF_AXON_UMBRAL_SPIKE:
    Determina cuando se produce el "spike" en el axón en función de la tensión superficial de la neurona.
 - COEF_AXON_ANCHO_PULSO:
    Determina cuanto tiempo (medido en pasos de la red) dura el axón en 1 y cuanto en 0.
 - COEF_SINAPSIS_ENTRENAMIENTO:
Determina el coeficiente de entrenamiento.
 - COEF_SINAPSIS_UMBRAL_PESO:
Determina el valor mínimo del peso de una sinapsis para que exista.
 
No hay operaciones que se hagan por fuera de las conexiones, el modelo es conexionista puro, no hay un espectador dentro del cerebro regulando la actividad, se pretende llegar a un modelo que no requiera el viejo teatro cartesiano presente en la historia del abordaje de la tarea de entender como funciona la mente.


*Función básica de las neuronas*

Integra en una suma el valor de sus dendritas y compara con el COEF_AXON_UMBRAL_SPIKE, en caso de superar el umbral de tensión se activa el axón por un tiempo fijo (COEF_AXON_ANCHO_PULSO).
Luego el axon toma valor 0 por un tiempo igual al que estuvo en 1, se tomó el criterio de hacerlo simétrico (mismo tiempo mínimo de actividad en uno y en creo) pero no es el único criterio que se puede tomar, la justificación de esta desición es que la actividad general en la red debería estar en un nivel aproximadamente estable, porque una red que converge a un estado estable en el que todas sus neoronas están encendidas o todas sus neuronas están apagadas no podría lograr nada de lo que se espera.
Las dendritas integran en una suma el valor de sus sinapsis.
La sinapsis toma el valor de la multiplicación de su peso por el valor del axón que está conectada a ella, una sinapsis tiene solo un axón conectado a ella.
También cabe destacar que la biología cuenta con sistemas tipo hormonales que no se describen como conexionistas, o sea, no llegan necesariamente a través de una sinapsis.
En este modelo se dispone de una magnitud tipo "hormonal". Que puede cambiar con el contexto dinamicamente pero no es parte de las conexiones pero sin embargo afecta a la actividad neuronal, es el COEF_SINAPSIS_ENTRENAMIENTO.
El COEF_SINAPSIS_ENTRENAMIENTO es el medio por el cual la red entera reacciona a una recompenza por un resultado esperado, es el medio por el cual puede tomarse a la red neuronal como supervisada.
Así como en la biología, se observan fenómenos de asociasión espontanea, sin regulación por parte de un supervisor, pero también se observa que para lograr algunas conductas observadas se requiere una supervisión.
La supervisión no es necesariamente algo personal, el mismo sistema nervioso nos hace llegar una recompensa por saciedad en nuestro estómago o estimulo placentero y conocido (por la evolución) en las papilas gustativas. El cuerpo y sus señales oficia de supervisor.

*Logros obtenidos*

Se pudo lograr la exclusión de la actividad neuronal, o sea, cuando una neurona se enciende por que sus dendritas coincidieron suficientemente con los patrones de entrada en sus sinapsis, inhibe a otras de activarse. Logrando la especialización de cada neurona en un conjunto de patrones, cada dendrita se especializa en un patron de actividad acomodando los pesos de sus sinapsis todos juntos al mismo tiempo.
La habilidad de hacer clústers auto organizados en el tiempo y espacio se logró sin recurrir a atajos conocidos no conexionistas, como por ejemplo elegir una ganadora u otro método que no salga del paradigma del teatro cartesiano realmente.
Se logró exclusivamente gracias a la forma de conectarse. Es un modelo conexionista puro, como lo observado en la biología.
Para lograr este funcnionamiento es crucial el modelado de dendritas inhibidoras, o sea, el modelado de la dendrita como algo ponderado, al margen de la ponderación de cada sinapsis.

Se pudo lograr el Pandemonio descripto por Daniel Dennet, la dinámica del conjunto de demonios.
La campana descripta por Kohonen al observar la retina de los gatos coincide con el demonio.
Al pandemonio se lo conoce también como maquina Joyceana.
En un pandemonio, no hay un espectador que determina la actividad, ésta es producto de la interacción entre
las partes.
Cada "joroba" cada conjunto de neuronas activadas y lindantes sería un demonio, que compite con el resto
para activarse al mismo tiempo que es activado en base a la actividad del resto. Competencia y cooperación
entre demonios es lo que sucede realmente.



*TEST*

Para lograr mi cometido necesité crear una interfaz gráfica y un test válido.
El test propuesto es que la Red pueda recibir entradas de un autómata y enviar las salidas correctas para
que el autómata pueda "sobrevivir" en el mundo virtual modelado.



*Lecturas recomendadas*

Agrego en el repositorio material de lectura relacionada y recomendada.
Esta documentación está en construcción y no tengo todavía todas las referencias bien ordenadas y con las citas que corresponde.
Pero sospecho que igual puede ser de utilidad mientras tanto ofrecer mis fuentes.
(Ver la carpeta ref)





El proyecto sigue en construcción hasta el el readme pueda redactarse solo..   ;)

Consejos para usar la interfaz: 
- Cuando estás en Pause podés apretar con el botón de la derecha sobre una neurona y ver sus sinapsis.
- Los botones tienen tooltip, leelos!.
- Si jugás con los coeficientes siempre podés actualizar la página y vuelve todo a la normalidad.
- Se recomienda usar Google Chrome y apretar F12 para ver la consola.
  Desde ahí puede inspeccionarse la red tipeando "red;", por ejemplo.

Saludos!

JoZbuyo


José Tabuyo