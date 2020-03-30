// window.onload = () => {
//     let fileCatcher = document.getElementById('file-catcher');
//     let fileInput = document.getElementById('file-input');
//     let fileListDisplay = document.getElementById('file-list-display');
//     let filename;
//     let fileList = [];
//     let renderFileList, sendFile;
//     let time_obj = document.getElementById("time");
//     let timer = undefined;
//     let start = undefined;
//     document.getElementById("preloader").style.display = "none";

//     document.getElementById("select")
//         .addEventListener('click', (event) => {
//             event.preventDefault();
//             fileInput.click();
//         });

//     fileCatcher.addEventListener('submit', async (event) => {
//         document.getElementById("preloader").style.display = "block";
//         start = 0;
//         timer = setInterval(() => {
//             start += 1;
//             time_obj.innerText = `${start / 10} 's`;
//         }, 100);

//         event.preventDefault();

//         await uploadFile(fileList);
//         fetchEval();
//     });

//     fileInput.addEventListener('change', (event) => {
//         fileList = [];
//         for (let i = 0; i < fileInput.files.length; i++) {
//             fileList.push(fileInput.files[i]);
//         }
//         renderFileList();
//     });

//     renderFileList = () => {
//         fileListDisplay.innerHTML = '';
//         fileList.forEach((file, index) => {
//             let fileDisplayEl = document.createElement('li');
//             fileDisplayEl.innerHTML = file.name;
//             fileListDisplay.appendChild(fileDisplayEl);
//         });
//     };

//     function uploadFile(files) {
//         return new Promise((resolve) => {
//             let checked = document.querySelector('input[name="type"]:checked').value;
//             console.log(files)
//             const formData = new FormData();
//             files.forEach(file => formData.append("file", file));
//             const xhr = new XMLHttpRequest();
            
//             xhr.open("POST", `./upload?option=${checked}`);
//             xhr.onreadystatechange = () => {
//                 if (xhr.readyState === 4 && xhr.status === 200) {
//                     const data = JSON.parse(xhr.responseText);
//                     if (!data["status"]) {
//                         uploadFile(files);
//                     } else {
//                         filename=data.filename;
//                         resolve();
//                     }
//                 }
//             };
//             xhr.send(formData);
//         });
//     };

//     function fetchEval() {
//         const xhr = new XMLHttpRequest();
//         xhr.timeout = 1000 * 3000;
//         xhr.open("GET", encodeURI(`./eval`), true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.onreadystatechange = () => {
//             document.getElementById("preloader").style.display = "none";
//             clearInterval(timer);
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 document.getElementById("result").style.display = "block";
//                 document.getElementById("log").innerText = xhr.responseText;
//                 document.getElementById("resultImage").src = `/results/${filename}`;
//             }
//         };
//         xhr.send(null);
//     }
// };