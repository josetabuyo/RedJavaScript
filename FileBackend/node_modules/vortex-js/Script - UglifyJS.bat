cls
echo Generacion de archivo vortex.min.js
pause
uglifyjs Filtros.js NodoRouter.js NodoClienteHTTP.js NodoConectorSocket.js NodoNulo.js Vortex.js -o vortex.min.js