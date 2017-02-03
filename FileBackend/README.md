RouterVortexNode
================

###Router vortex para node.js
-Recibe y rutea mensajes.

-Recibe, combina y envía filtros de mensajes.

-Soporta envío y recepción de mensajes vía polling HTTP y por WebSockets.

Router de prueba funcionando en: http://router-vortex.herokuapp.com/

Conectar utilizando los adaptadores en https://github.com/jlurgo/VortexJS

Por polling HTTP:
```
var clienteHTTP = new NodoClienteHTTP('http://router-vortex.herokuapp.com'); 
```

Por webSockets
```
var socket = io.connect('https://router-vortex.herokuapp.com');
var adaptador = new NodoConectorSocket(socket);    
```
