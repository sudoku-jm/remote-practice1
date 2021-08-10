
// $(function(){
//   uiDom();
// });

//uiDom
// let $sch_list;
// function uiDom(){

//  $sch_list = $('.sch_list');
// }



let apikey ="";
let playListId = "PLcqDmjxt30RvEEN6eUCcSrrH-hKjCT4wt";
let items;
let videoHtmls =[];
let videoHtml;


$.ajax({
  type : 'GET',
  dataType : 'json',
  url : "https://www.googleapis.com/youtube/v3/playlistItems?playlistId="+playListId+"&part=snippet&maxResults=2&key="+apikey,
  contentType : 'application/json',
  success : function(jsonData){

    //검색 뿌려주기
    for (let i = 0; i < jsonData.items.length; i++) { 
      items = jsonData.items[i]; 
      // console.log(items); 


      // console.log(items.snippet.resourceId.videoId); 
      // console.log(items.snippet.title); 
      // console.log(items.snippet.thumbnails.default.url); 

      let videoId = items.snippet.resourceId.videoId;
      let videoTitle = items.snippet.title;
      let videoThumbnail = items.snippet.thumbnails.default.url;
      
      videoHtml = `
      <li class="item">
          <a href="javascript:;" class="kwd">
            <input type="hidden" name="videoId" value="${videoId}">
            <input type="hidden" name="videoThumbnail" value="${videoThumbnail}">
            <div>
              <p>${videoTitle}</p>
            </div>
            <span>예약</span>
          </a>
        </li>
      `;
  
      // console.log(videoHtml);
      videoHtmls += videoHtml;
      
      
      // console.log(videoHtmls);

      // VideoHtml.html();
      // document.getElementsByClassName('sch_list')[0].innerHTML = VideoHtml
    }
    // console.log(document.getElementsByClassName('sch_list')[0].innerHTML = videoHtmls);
    document.getElementsByClassName('sch_list')[0].innerHTML = videoHtmls
  },
  complete : function(data){
    // console.log(data.items);

    //updateStorageSong
    
  let itemSchList = document.querySelectorAll('.item');
  let songObj,songObjStr = [];
  let videoId = '',videoThumbnail = '',videoTitle = '';

    for(let i = 0; i<itemSchList.length; i++){
      itemSchList[i].addEventListener('click', function(e){
          videoId = this.querySelector('input[name="videoId"]').value;
          videoThumbnail = this.querySelector('input[name="videoThumbnail"]').value;
          videoTitle = this.querySelector('p').innerText;
          songObj = {
            // "id" : videoId,
            "thumbnail" : videoThumbnail,
            "title" : videoTitle
          };
          // console.log(videoId);
          // console.log(videoThumbnail);
          // console.log(videoTitle);

          updateSongList(videoId,videoThumbnail,videoTitle);
          
   
          songObjStr = JSON.stringify(songObj);
          localStorage.setItem(videoId,songObjStr);


        });
      }

      //printLocalStorage
      selectLocalStorage();
      deleteLocalStorage();
    

    
  },
  error : function(xhr, status, error){
    console.log("유튜브 요청 에러"+error);
  }
});

window.onload = function(){
  

  //deleteLocalStorage
  let localClear = document.getElementById('localClear');
  localClear.addEventListener("click",function(e){
    if(confirm('예약 리스트를 모두 지우시겠습니까?')){
      localStorage.clear();
      selectLocalStorage();
    }
    // alert('지우기');
  })


 
}


function deleteLocalStorage(){
  let deleteBtn = document.getElementById('deleteItem');
  deleteBtn.addEventListener('click',function(){
    // console.log(document.querySelectorAll('input[name="videoItem"]').checked);
    let chklist = document.querySelectorAll('input[name="videoItem"]:checked');

    chklist.forEach(function(ch){
      console.log(ch.id);
      // JSON.parse(localStorage.getItem(localStorage.key(ch.id)));
      // console.log(JSON.parse(localStorage.getItem(localStorage.key(ch.id))));
      // console.log(localStorage.key(ch.id));
      localStorage.removeItem(ch.id);
    })
    selectLocalStorage();
  });
}
 //printLocalStorage
function selectLocalStorage(){

  if(localStorage.length > 0){
    document.getElementsByClassName('songList')[0].innerHTML = '';

    for(let i = 0; i<localStorage.length; i++){
      let obj = [];

      obj[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
      songObj = {
          "videoId" : localStorage.key(i),
          "videoThumbnail" :  obj[i].thumbnail,
          "videoTitle" : obj[i].title,
      };
        
        let songStr = `
          <div>
            <input type="hidden" name="videoId" value="${songObj.videoId}">
            <input type="hidden" name="videoThumbnail" value="${songObj.videoThumbnail}">
            <input type="hidden" name="videoTitme" value="${songObj.videoTitle}">
            <input type="checkbox" name="videoItem" id="${songObj.videoId}">
            <label for="${songObj.videoId}">
            id : ${songObj.videoId} , 썸네일 : ${songObj.videoThumbnail} , 제목 : ${songObj.videoTitle}
            </label>
          </div>
        `;
        document.getElementsByClassName('songList')[0].innerHTML += songStr;
    }
  }else{
    document.getElementsByClassName('songList')[0].innerHTML = '';
  }


}

function updateSongList(videoId,videoThumbnail,videoTitle){
  let songStr = `
    <div>
      <input type="hidden" name="videoId" value="${videoId}">
      <input type="hidden" name="videoThumbnail" value="${videoThumbnail}">
      <input type="hidden" name="videoTitme" value="${videoTitle}">
      <input type="checkbox" name="videoItem" id="${videoId}">
      <label for="${videoId}">
      id : ${videoId} , 썸네일 : ${videoThumbnail} , 제목 : ${videoTitle}
      </label>
    </div>
  `;

  // console.log(songStr);
  if(localStorage.getItem(videoId) != null){
    alert('이미 예약되어 있는 곡입니다.');
  }else{
    document.getElementsByClassName('songList')[0].innerHTML += songStr;
  }
  // console.log(localStorage.getItem(videoId));


}


