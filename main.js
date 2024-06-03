function fetchUsers(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            loadUsers(JSON.parse(this.responseText));
        }
    };
    req.open("GET","https://6652deba813d78e6d6d6710c.mockapi.io/users/v1/crud_database");
    req.send();
}
function loadUsers(data){
    const table = document.getElementById('table-body');
    table.innerHTML ="";
    for(i=0;i<data.length;i++){
        let row =  `<div class="table-row" data-id="${data[i]["ID"]}">
        <span class="cell" data-key="ID">${data[i]["ID"]}</span>
        <span class="cell" data-key="First">${data[i]["First"]}</span>
        <span class="cell" data-key="Last">${data[i]["Last"]}</span>
        <span class="cell" data-key="Email">${data[i]["Email"]}</span>
        <span class="cell" data-key="Phone">${data[i]["Phone"]}</span>
        <span class="cell" data-key="Location">${data[i]["Location"]}</span>
        <span class="cell" data-key="Hobby">${data[i]["Hobby"]}</span>
        <span>
            <button class="edit">Edit</button>
            <button class="save" style="display:none;">Save</button>
            <button class="deleteRow">Delete</button>
        </span>
    </div>`;;
table.insertAdjacentHTML('beforeend', row);
    }
    attachEventListeners();
}
document.addEventListener('DOMContentLoaded',fetchUsers);

function addUser() {
    let id = document.getElementById('id').value;
    let first = document.getElementById('first').value;
    let last = document.getElementById('last').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let location = document.getElementById('location').value;
    let hobby = document.getElementById('hobby').value;
    document.addEventListener('DOMContentLoaded', function() {
        fetchLastID();
    });

  //enter id as per serial for example if last id is 10 then enter 11 in next addItem entry
    console.log("ID:", id); 

    let data = JSON.stringify({
        ID: id,
        First: first,
        Last: last,
        Email: email,
        Phone: phone,
        Location: location,
        Hobby: hobby
    });

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Item added successfully!");
            window.location.href = 'index.html';
        }
    };
    req.open("POST", "https://6652deba813d78e6d6d6710c.mockapi.io/users/v1/crud_database");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addItemBtn').addEventListener('click', addUser);
});
function attachEventListeners() {
    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', editUser);
    });

    document.querySelectorAll('.save').forEach(button => {
        button.addEventListener('click', saveUser);
    });
    document.querySelectorAll('.deleteRow').forEach(button => {
        button.addEventListener('click', function(event) {
            const row = event.target.closest('.table-row');
            const id = row.getAttribute('data-id');
            const firstName = row.querySelector('[data-key="First"]').textContent;
            PopUpMsg(firstName);
            deleteUsers(id);
        });
    });
}

function editUser(event) {
    const row = event.target.closest('.table-row');
    row.querySelectorAll('.cell').forEach(cell => {
        const value = cell.textContent;
        const key = cell.getAttribute('data-key');
        cell.innerHTML = `<input type="text" data-key="${key}" value="${value}">`;
    });
    row.querySelector('.edit').style.display = 'none';
    row.querySelector('.save').style.display = 'inline';

    row.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveUser({ target: row.querySelector('.save') });
        }
    });
}

function saveUser(event) {
    const row = event.target.closest('.table-row');
    const id = row.getAttribute('data-id');
    const updatedData = {};

    row.querySelectorAll('input').forEach(input => {
        const key = input.getAttribute('data-key');
        const value = input.value;
        updatedData[key] = value;
    });

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log("Item updated successfully!");
            fetchUsers(); 
        }
    };
    req.open("PUT", `https://6652deba813d78e6d6d6710c.mockapi.io/users/v1/crud_database/${id}`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(updatedData));
}

function deleteUsers(id,firstName) {
    const deleteButton = document.querySelector("#popup .delete");
    const cancelButton = document.querySelector("#popup .cancel");
    
    deleteButton.onclick = function() {
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Item deleted successfully!");
                fetchUsers(); 
            }
        };
        req.open("DELETE", `https://6652deba813d78e6d6d6710c.mockapi.io/users/v1/crud_database/${id}`);
        req.send();

        PopUpclose();
    };

    cancelButton.onclick = function() {
        PopUpclose();
    };
}


function PopUpMsg(firstName) {
    const popup = document.getElementById('popup');
    const popcontent =document.getElementById('popcontent');
    popcontent.style.display = "block";
    popup.style.visibility = "hidden"; 
   
    popup.classList.add('openpopup');
    popup.style.position = "absolute";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "rgb(250, 250, 250)";
    popup.style.zIndex = "1";
    popup.style.left = "40%";
    popup.style.top = "30%";
    popup.style.width = "400px";
    popup.style.height = "300px";
    popup.style.overflow = "auto";
    popup.style.borderRadius = "10px";
  
    const h3 = popup.querySelector('h3');
    h3.style.marginLeft = "20px";
    const h2 = popup.querySelector('h2');
    h2.textContent = `Deleting: ${firstName}`;
    h2.style.marginLeft = "20px";
  
    const buttons = popup.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.border = "none";
      button.style.color = "white";
      button.style.padding = "15px 25px";
      button.style.textAlign = "center";
      button.style.textDecoration = "none";
      button.style.display = "inline-block";
      button.style.fontSize = "16px";
      button.style.margin = "4px 2px";
      button.style.cursor = "pointer";
      button.style.marginLeft = "50px";
      button.style.borderRadius = "15px";
    });
  
    const closeButton = document.querySelector('.close-btn'); 
    closeButton.style.visibility = "visible";
  
    const deleteButton = popup.querySelector('.delete');
    deleteButton.style.backgroundColor = "#dd4b39";
    deleteButton.style.marginTop = "50px";
  
    const cancelButton = popup.querySelector('.cancel');
    cancelButton.style.backgroundColor = "#ccc";
    cancelButton.style.marginTop = "50px";
  
    document.body.classList.add('popup-active');
    setTimeout(() => {
      popup.style.visibility = "visible"; 
    }, 100);
  }
  

  document.querySelector('.close-btn').onclick = function() {
    
    PopUpclose();
    

};
function PopUpclose() {
    popup.style.visibility = "hidden";
    popup.style.top = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0.7)";
    document.body.classList.remove('popup-active');
}