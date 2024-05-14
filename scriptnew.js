// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getDatabase, ref, set, push , onValue,onChildAdded, onChildChanged, onChildRemoved, update,child   } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAeDpauyCg3wcUAZQ3xQ8KKUrC_e9l9pdU",
    authDomain: "lbtcuoiky.firebaseapp.com",
    databaseURL: "https://lbtcuoiky-default-rtdb.firebaseio.com",
    projectId: "lbtcuoiky",
    storageBucket: "lbtcuoiky.appspot.com",
    messagingSenderId: "199904249141",
    appId: "1:199904249141:web:8793b47b33fb269e51b87c",
    measurementId: "G-LQF5LM997S"
  };


  
// Click vào chữ Trả lời
// Define inputReply outside the event listener and set it to null
document.addEventListener("DOMContentLoaded", (e) => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("reply") || e.target.classList.contains("inputReply") || e.target.classList.contains("sendReply")) {
      let parent = e.target.closest(".parentRep");
      let blockReply = parent.querySelector(".blockReply");
      blockReply.style.display = "block";
    } else {
      // Get all inputReply elements
      let inputReplies = document.querySelectorAll(".inputReply");
      let blockReplyAll = document.querySelectorAll(".blockReply");
      // Loop through each inputReply element and hide it
      inputReplies.forEach(inputReply => {
        inputReply.value = ""; // Clear the value if needed
      });
      blockReplyAll.forEach(block => {
        block.style.display = "none";
      })
    }
  });
});




// Random ID User
function generateRandomText(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function generateRandomNumberWithTime(min, max) {
  const timestamp = Date.now(); // Lấy thời gian hiện tại dưới dạng timestamp
  const seed = timestamp % 1000; // Lấy phần dư để tạo ra một seed ngẫu nhiên từ thời gian
  
  // Sử dụng seed để tạo số ngẫu nhiên
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + seed) % (max - min + 1) + min;
  
  return randomNumber;
}

function RandomIdUser() {
  const lengthToken = generateRandomNumberWithTime(250,2500);
  return generateRandomText(lengthToken);
}



// Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const database = getDatabase(app); // Thêm dòng này

let nameUser; 
let Message;
let IDClient;

function initNameUser() {
  let data = JSON.parse(localStorage.getItem('data')) || {};
  if (data === null || data === undefined || data.name == null || data.name == "") {
      // Khởi tạo một đối tượng dữ liệu mới nếu không có trong LocalStorage
      data.name = prompt("Nhập tên của bạn");
      let showName = document.querySelector("#showName");
      showName.textContent = data.name;
      localStorage.setItem('data', JSON.stringify(data));
  }
};

function initIDClient() {
  let data = JSON.parse(localStorage.getItem('data')) || {};
  if (data.ID == null || data.ID == "") {
      // Khởi tạo ID mới nếu không có trong LocalStorage
      IDClient = RandomIdUser();
      data.ID = IDClient;
      localStorage.setItem('data', JSON.stringify(data));
  }
}

document.addEventListener("DOMContentLoaded",()=> {
  const data = JSON.parse(localStorage.getItem('data'));
  let showName = document.querySelector("#showName");
  showName.textContent = data.name;
  initIDClient();
})

// Send message len firebase
function sendMessage(e) {
    e.preventDefault();
    nameUser = JSON.parse(localStorage.getItem('data')).name;
    Message = document.querySelector("#message").value;
    IDClient = JSON.parse(localStorage.getItem('data')).ID;
    rep = [];
    if(!nameUser || Message == "") {
      return;
    }
    const postListRef = ref(database, 'messages');
    const newPostRef = push(postListRef);
    set(newPostRef, {
        name:nameUser,
        message:Message,
        ID: IDClient
    });
    document.getElementById("sendMessage").reset();
    return false;
}

// Show reply từ firebase lên UI

  let blockRepdetail = document.querySelector(".showRepDB")
  let Rep = ``; 



let countCmt = 0;
let discussdetail = document.querySelector(".discuss-detail")
let messages = ``; // Initialize an empty string to store messages
const messageRef = ref(database, 'messages');
  onChildAdded(messageRef, (data) => {
//   addCommentElement(postElement, data.key, data.val().text, data.val().author);
    let sender = data.val().name;
    let message = data.val().message;
    let idUser = data.val().ID;
    // Add new message to the accumulated messages string
    messages = `
      <div class="row">
        <div class="col d-flex">
          <span class="d-inline-block flex-shrink-0">${sender}:</span> <p class="flex-grow-1 mb-0 ms-2">${message}</p>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col d-flex parentRep">
          <p class="d-none IDMessage">${data.key}</p>
          <p class="reply flex-shrink-0">Trả lời </p>
          <div class="position-relative blockReply">
            <input class="inputReply p-2 pe-4 ms-4">
            <i class="d-inline-block h-100 p-1 bi bi-send-fill position-absolute sendReply"></i>
          </div>

          <div class="row rowShow mt-2 ms-4 flex-grow-1">
            <div class="ms-5 col showRepDB"> 
  
            </div>
          </div>
        </div>
      </div>
      
      <hr>
    `;
    discussdetail.insertAdjacentHTML("afterbegin",messages);
    countCmt++;
    let quantityCmt = document.querySelector(".quantitycmt");
    quantityCmt.textContent = countCmt;

    const messageId = data.key;
    const replyRef = ref(database, 'messages/' + messageId + '/reply');
    onChildAdded(replyRef, (dataReply) => {
      const replyContent = dataReply.val();
      let replyContainer;
      let IDmes = document.querySelectorAll(".IDMessage");
      for(let i =0;i<IDmes.length;i++) {
        if(IDmes[i].textContent == messageId) {
          replyContainer = IDmes[i].parentNode.querySelector(".showRepDB");
        }
      }
      // Hiển thị các phản hồi mới nhất
      if (replyContent) {
          const replyHTML = `
            <div class="d-flex">
              <span class="d-inline-block flex-shrink-0">${replyContent.Username}:</span>
              <p class="flex-grow-1 mb-0 ms-2">${replyContent.content}</p>
            </div>
          `;
          replyContainer.insertAdjacentHTML('afterbegin', replyHTML);
      }
    });
});





// let countCmt = 0;
// onValue(messageRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const childData = childSnapshot.val();
//       messages = `
//             <div class="row">
//               <div class="col">
//                 <span>${childData.name} :</span> <span>${childData.message}</span>
//               </div>
//             </div>
//             <hr>
//           `;
//           discussdetail.insertAdjacentHTML("afterbegin",messages);
//           countCmt++;
//     });
//     let quantityCmt = document.querySelector(".quantitycmt");
//     quantityCmt.textContent = countCmt;
//   }, {
//     onlyOnce: true
//   });


let btn = document.querySelector(".submitform");
btn.addEventListener("click", (e) => {
  initNameUser();
  sendMessage(e);
}
);

// Send Reply lên firebase
function SendReply(IDMessage, newReply) {
  const updates = {};
  updates['/messages/' + IDMessage + '/reply'] = newReply;
  update(ref(database), updates);
}


let rep = [];
document.addEventListener("click", (e) => {
  let target = e.target;
  if (target.classList.contains('sendReply')) {
    let data = JSON.parse(localStorage.getItem('data'));
    let inputElement = target.closest(".blockReply").querySelector(".inputReply");
    let contentRep = inputElement.value;
    let nameUser = data.name;
    let objectRep = { Username: nameUser, content: contentRep };
    inputElement.value = "";

    let parentRep = target.closest(".parentRep");
    let IDMes = parentRep.querySelector(".IDMessage").textContent;

    // Get existing replies from Firebase, or create a new array if none exist
    const messageRef = ref(database, 'messages/' + IDMes + '/reply');
    onValue(messageRef, (snapshot) => {
      const existingReplies = snapshot.val() || [];
      existingReplies.push(objectRep);
      SendReply(IDMes, existingReplies);
    }, { onlyOnce: true });
  }
});

document.addEventListener("keydown", (e) => {
  let target = e.target;
  if (target.classList.contains('inputReply') && e.key === 'Enter') {
    e.preventDefault();  // Ngăn chặn hành động mặc định của Enter (submit form hoặc tạo dòng mới)
    let data = JSON.parse(localStorage.getItem('data'));
    let inputElement = target.closest(".blockReply").querySelector(".inputReply");
    let contentRep = inputElement.value;
    let nameUser = data.name;
    let objectRep = { Username: nameUser, content: contentRep };
    inputElement.value = "";

    let parentRep = target.closest(".parentRep");
    let IDMes = parentRep.querySelector(".IDMessage").textContent;

    // Get existing replies from Firebase, or create a new array if none exist
    const messageRef = ref(database, 'messages/' + IDMes + '/reply');
    onValue(messageRef, (snapshot) => {
      const existingReplies = snapshot.val() || [];
      existingReplies.push(objectRep);
      SendReply(IDMes, existingReplies);
    }, { onlyOnce: true });
  }
});

// Rename 
let btnRename = document.querySelector(".btn-rename");
btnRename.addEventListener("click",()=> {
  const data = JSON.parse(localStorage.getItem('data'));
  let newName = prompt("Nhập tên mới của bạn");
  if(newName) {
    data.name = newName;
    let showName = document.querySelector("#showName");
    showName.textContent = data.name;
    localStorage.setItem('data', JSON.stringify(data));
  }
})


// 
async function postMessage(MessageContact) {
  const API_Post = "https://docs.google.com/forms/d/e/1FAIpQLSedaj5oLyu9YXRiaFIO1lRiXlHEwkSQzU-LPtAZZc-bm4Z6OA/formResponse";
  const formdata = new FormData();
  formdata.append("entry.136578000",MessageContact.name);
  formdata.append("entry.204168168",MessageContact.email);
  formdata.append("entry.1712607988",MessageContact.message);
  fetch(API_Post, {
    method: "POST",
    body: formdata,
    mode: "no-cors",
  });
}

// Contact Us

// document.addEventListener("DOMContentLoaded", (e) => {
//   //contact
//   let checkFormValid = true;
// let nameContact = document.querySelector(".nameContact");
// let emailContact = document.querySelector(".emailContact");
// let messageContact = document.querySelector(".messageContact");
// let submitContact = document.querySelector("#btn-Custom");

//   submitContact.addEventListener("click", () => {
//     if (nameContact.value == "") {
//       // Kiểm tra xem có phần tử .error_name không
//       let errorName = document.querySelector(".error_name");
//       if (!errorName) {
//         checkFormValid = false;
//         // Nếu không, chèn một phần tử mới
//         let parent = nameContact.parentNode;
//         parent.insertAdjacentHTML(
//           'beforeend',
//           `<p style="color: red;" class="my-2 error_name"> <i class="bi bi-exclamation-circle-fill"></i> Trường này là bắt buộc</p>`
//         );
//       }
//     } else {
//       // Xóa phần tử .error_name nếu nó tồn tại
//       let errorName = document.querySelector(".error_name");
//       if (errorName) {
//         errorName.remove();
//       }
//     }
  
//     // kiểm tra email rỗng
//     if (emailContact.value == "") {
//       // Kiểm tra xem có phần tử .error_name không
//       let errorMail = document.querySelector(".error_mail");
//       if (!errorMail) {
//         checkFormValid = false;
//         // Nếu không, chèn một phần tử mới
//         let parent = emailContact.parentNode;
//         parent.insertAdjacentHTML(
//           'beforeend',
//           `<p style="color: red;" class="my-2 error_mail"> <i class="bi bi-exclamation-circle-fill"></i> Trường này là bắt buộc</p>`
//         );
//       }
//     } else {
//       // Xóa phần tử .error_name nếu nó tồn tại
//       let errorMail = document.querySelector(".error_mail");
//       if (errorMail) {
//         errorMail.remove();
//       }
//     }
    
//     if(nameContact.value != "" && emailContact.value != "") {
//       checkFormValid = true;
//     }

//     // form đã có dữ liệu và post đc
//     if (checkFormValid === true) {
//       const objectMessage =
//       {
//         name : nameContact.value,
//         email: emailContact.value,
//         message: messageContact.value,
//       }

//       //post lên google sheet
//       postMessage(objectMessage);
//       document.querySelector(".messageContact").value = "";
//       nameContact.value ="";
//       emailContact.value = "";
//       document.querySelector("#contactForm").insertAdjacentHTML("beforeend",
//       `<div>
//         <p style="color:green;text-align:center;" class="sendSuscess">Gửi thành công</p>
//       </div>`
//     )

//     setTimeout(()=> {
//       let sucess = document.querySelector(".sendSuscess");
//       if(sucess) {
//         sucess.parentNode.remove();
//       }
//     },1000)
//     }
//   });
// })

