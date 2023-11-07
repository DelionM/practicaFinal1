if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
  console.log("entre al sw")
}

const pageInicio = document.getElementById("pageInicio");
const pageProductos = document.getElementById("pageProductos");
const pageCategorias = document.getElementById("pageCategorias");
const pageListas = document.getElementById("pageListas");

const btnInicio = document.getElementById("btn-inicio");
const btnProductos = document.getElementById("btn-productos");
const btnCategorias = document.getElementById("btn-categorias");
const btnListas = document.getElementById("btn-listas");

const inputImagen = document.getElementById('inputImagen');
const imgElement = document.getElementById('imagenProducto');
const selectElement = document.getElementById('imagenSelect');
const nombreProductoElement = document.getElementById('nombreProducto');
const precioProductoElement = document.getElementById('precioProducto');
const categoriaProductoElement = document.getElementById('categoriaProducto');


// Agregar evento al botón de guardar
const guardarButton = document.getElementById('btn-guardar-producto');




window.onload = function () {
  pageInicio.style.display = "block";
  pageProductos.style.display = "none";
  pageCategorias.style.display = "none";
  pageListas.style.display = "none";

  btnInicio.classList.add("active");
  btnProductos.classList.remove("active");
  btnCategorias.classList.remove("active");
  btnListas.classList.remove("active");
};

function show(param_div_id) {
  if (param_div_id === "pageInicio") {
    pageInicio.style.display = "block";
    pageProductos.style.display = "none";
    pageCategorias.style.display = "none";
    pageListas.style.display = "none";
    btnInicio.classList.add("active");
    btnProductos.classList.remove("active");
    btnCategorias.classList.remove("active");
    btnListas.classList.remove("active");
  } else if (param_div_id === "pageProductos") {
    btnInicio.classList.remove("active");
    btnProductos.classList.add("active");
    btnCategorias.classList.remove("active");
    btnListas.classList.remove("active");
    pageInicio.style.display = "none";
    pageProductos.style.display = "block";
    pageCategorias.style.display = "none";
    pageListas.style.display = "none";
  } else if (param_div_id === "pageCategorias") {
    btnInicio.classList.remove("active");
    btnProductos.classList.remove("active");
    btnCategorias.classList.add("active");
    btnListas.classList.remove("active");
    pageInicio.style.display = "none";
    pageProductos.style.display = "none";
    pageCategorias.style.display = "block";
    pageListas.style.display = "none";
  } else {
    btnInicio.classList.remove("active");
    btnProductos.classList.remove("active");
    btnCategorias.classList.remove("active");
    btnListas.classList.add("active");
    pageInicio.style.display = "none";
    pageProductos.style.display = "none";
    pageCategorias.style.display = "none";
    pageListas.style.display = "block";
  }
}

(function () {
  "use strict";

  var db = new PouchDB("shopping-lists");
  var remoteCouch = false;
  var cookie;

  db.info(function (err, info) {
    db.changes({
      since: info.update_seq,
      onChange: showList,
      continuous: true,
    });
  });

  // listas DOM elements
  // We have to create a new todo document and enter it in the database
  function addList(listName) {
    var list = {
      _id: "list_" + new Date().toISOString(),
      name: listName,
      type: "list",

    };
    db.post(list, function (err) {
      if (!err) {
        console.log("Successfully posted a list!");
      }
    });
  }

  function createListsListItem(list) {
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(list.name));
    label.addEventListener("dblclick", todoDblClicked.bind(this, list));

    var deleteLink = document.createElement("button");
    deleteLink.className = "destroy";
    deleteLink.addEventListener("click", deleteButtonPressed.bind(this, list));

    var divDisplay = document.createElement("div");
    divDisplay.className = "view";
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement("input");
    inputEditTodo.id = "input_" + list._id;
    inputEditTodo.className = "edit";
    inputEditTodo.value = list.name;
    inputEditTodo.addEventListener("keypress", todoKeyPressed.bind(this, list));
    inputEditTodo.addEventListener("blur", todoBlurred.bind(this, list));

    var li = document.createElement("li");
    li.id = "li_" + list._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    return li;
  }

  function todoKeyPressed(list, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById("input_" + list._id);
      inputEditTodo.blur();
    }
  }
  function todoBlurred(list, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      db.remove(list);
    } else {
      list.name = trimmedText;
      db.put(list);
    }
  }
  function todoDblClicked(list) {
    var div = document.getElementById("li_" + list._id);
    var inputEditTodo = document.getElementById("input_" + list._id);
    div.className = "editing";
    inputEditTodo.focus();
  }

  // User pressed the delete button for a todo, delete it
  function deleteButtonPressed(list) {
    db.remove(list);
  }

  function showList() {
    db.allDocs({ include_docs: true, startkey: "list_", endkey: "list_\uffff" }, function (err, doc) {
      redrawListUI(doc.rows);
    });
  }

  function redrawListUI(lists) {
    var ul = document.getElementById("listas-list");
    ul.innerHTML = "";
    lists.forEach(function (list) {
      ul.appendChild(createListsListItem(list.doc));
    });
  }

  // Initialise a sync with the remote server
  function sync() {
    syncDom.setAttribute("data-sync-state", "syncing");
    var remote = new PouchDB(remoteCouch, { headers: { Cookie: cookie } });
    var pushRep = db.replicate.to(remote, {
      continuous: true,
      complete: syncError,
    });
    var pullRep = db.replicate.from(remote, {
      continuous: true,
      complete: syncError,
    });
  }

  const newListDom = document.getElementById("nombreLista");
  const ENTER_KEY = 13;

  function newListButtonHandler() {
    var newListText = newListDom.value.trim(); // Eliminar espacios

    if (newListText !== "") {
      addList(newListText);
      newListDom.value = "";
    }
  }

  function addEventListeners() {
    document
      .getElementById("btn-guardar-lista")
      .addEventListener("click", newListButtonHandler);
  }

  addEventListeners();
  showList();
  // listas DOM elements




// categorias DOM elements
  // We have to create a new todo document and enter it in the database
  function addCategory(categoryName) {
    var category = {
      _id: "category_" + new Date().toISOString(),
      name: categoryName,
      type: "category",

    };
    db.post(category, function (err) {
      if (!err) {
        console.log("Successfully posted a category!");
      }
    });
  }

  function createCategoryListItem(category) {


    var label = document.createElement("label");
    label.appendChild(document.createTextNode(category.name));
    label.addEventListener("dblclick", todoDblClickedCategory.bind(this, category));

    var deleteLink = document.createElement("button");
    deleteLink.className = "destroy";
    deleteLink.addEventListener("click",  deleteButtonPressedCategory.bind(this, category));

    var divDisplay = document.createElement("div");
    divDisplay.className = "view";
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement("input");
    inputEditTodo.id = "input_" + category._id;
    inputEditTodo.className = "edit";
    inputEditTodo.value = category.name;
    inputEditTodo.addEventListener("keypress", todoKeyPressedCategory.bind(this, category));
    inputEditTodo.addEventListener("blur", todoBlurredCategory.bind(this, category));

    var li = document.createElement("li");
    li.id = "li_" + category._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    return li;
  }

  function todoKeyPressedCategory(category, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById("input_" + category._id);
      inputEditTodo.blur();
    }
  }
  function todoBlurredCategory(category, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      db.remove(category);
    } else {
      category.name = trimmedText;
      db.put(category);
    }
  }
  function todoDblClickedCategory(category) {
    var div = document.getElementById("li_" + category._id);
    var inputEditTodo = document.getElementById("input_" + category._id);
    div.className = "editing";
    inputEditTodo.focus();
  }

  // User pressed the delete button for a todo, delete it
  function deleteButtonPressedCategory(category) {
    db.remove(category);
  }

  function showListCategory() {
    db.allDocs({ include_docs: true, startkey: "category_", endkey: "category_\uffff" }, function (err, doc) {
      redrawListUICategory(doc.rows);
    });
  }

  function redrawListUICategory(categorys) {
    var ul = document.getElementById("categorias-list");
    ul.innerHTML = "";
    categorys.forEach(function (category) {
      ul.appendChild(createCategoryListItem(category.doc));
    });
  }



  const newCategoryDom = document.getElementById("nombreCategoria");


  function newListButtonHandlerCategory() {
    var newListText = newCategoryDom.value.trim(); // Eliminar espacios

    if (newListText !== "") {
      addCategory(newListText);
      newCategoryDom.value = "";
    }
  }

  function addEventListenersCategory() {
    document
      .getElementById("btn-guardar-categoria")
      .addEventListener("click", newListButtonHandlerCategory);
  }

  addEventListenersCategory();
  showListCategory();
  // categorias DOM elements

// Agrega esto después de tu función showList:
db.info(function (err, info) {
  db.changes({
    since: info.update_seq,
    onChange: showListCategory,
    continuous: true,
  });
});




  // Obtén referencias a los elementos del DOM
  const imagenProducto = document.getElementById("imagenProducto");
  const imagenPredeterminada = "./assets/imgs/picture-2008484_1280.webp";

  // Escucha el evento change del input de tipo archivo
  inputImagen.addEventListener("change", function () {
    const archivo = inputImagen.files[0];

    if (archivo) {
      // Si se selecciona un archivo, muestra la imagen seleccionada
      const reader = new FileReader();
      reader.onload = function (e) {
        imagenProducto.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
    } else {
      // Si no se selecciona ningún archivo, vuelve a la imagen predeterminada
      imagenProducto.src = imagenPredeterminada;
    }
  });














var productos = [];



guardarButton.addEventListener('click', function () {
    var files = inputImagen.files;
    for (var i = 0; i < files.length; i++) {
        var imagenSeleccionada = files[i];
        convertirImagenABase64(imagenSeleccionada, function (base64Data) {
            var nombre = document.getElementById('inputnombreProducto').value;
            var precio = document.getElementById('inputprecioProducto').value;
            var categoria = document.getElementById('inputcategoriaProducto').value;
            var producto = { nombre, precio, categoria, data: base64Data };
            productos.push(producto);
            guardarProductoEnPouchDB(producto);
            // actualizarSelect();
        });
    }
});

function convertirImagenABase64(imagen, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var base64Data = event.target.result.split(',')[1];
        callback(base64Data);
    };
    reader.readAsDataURL(imagen);
}

function guardarProductoEnPouchDB(producto) {
    var nombre = producto.nombre;

    var producto = {
        _id: 'producto_' + new Date().toISOString(),
        name: nombre,
        type: 'producto',
        data: producto.data,
        precio: producto.precio,
        categoria: producto.categoria
      };

      db.post(producto, function (err) {
        if (!err) {
          console.log("Successfully posted a product!");
        }
      });
}


function showListProduct() {
  db.allDocs({ include_docs: true, startkey: "producto_", endkey: "producto_\uffff" }, function (err, doc) {
    redrawListUIProduct(doc.rows);
  });
}

const listaProductosElement = document.getElementById('listaProductos');

function redrawListUIProduct(products) {
  var ul = document.getElementById('listaProductos');
  ul.innerHTML = "";
  products.forEach(function (product) {
    ul.appendChild(createProductListItem(product.doc));
  });
}




function createProductListItem(producto) {

  listaProductosElement.innerHTML = '';

      var listItem = document.createElement('li');

      listItem.className = "producto";

      listItem.innerHTML = `
          <img src="data:image/jpeg;base64, ${producto.data}" alt="${producto.name}">
          <div class="detalles">
              <h2>${producto.name}</h2>
              <p>$${producto.precio}</p>
          </div>
          `
      listaProductosElement.appendChild(listItem);

  return listItem;
}



showListProduct()

// Agrega esto después de tu función showList:
db.info(function (err, info) {
  db.changes({
    since: info.update_seq,
    onChange: showListProduct,
    continuous: true,
  });
});

function createCategoryListItemSelect(category) {
 
  var option = document.createElement("option");
   
  option.innerHTML =  `
  <option value="${category.name}">${category.name}</option>
  `
  return option;
}


function showListCategorySelect() {
  db.allDocs({ include_docs: true, startkey: "category_", endkey: "category_\uffff" }, function (err, doc) {
    redrawListUICategorySelect(doc.rows);
  });
}

function redrawListUICategorySelect(categorys) {

  const select = document.getElementById("inputcategoriaProducto");

  select.innerHTML = "";
  categorys.forEach(function (category) {
    select.appendChild(createCategoryListItemSelect(category.doc));
  });
}


showListCategorySelect()

// Agrega esto después de tu función showList:
db.info(function (err, info) {
  db.changes({
    since: info.update_seq,
    onChange: showListCategorySelect,
    continuous: true,
  });
});

})();
