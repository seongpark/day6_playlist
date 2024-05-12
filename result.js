//GET 키워드 받아오기
const urlParams = new URLSearchParams(window.location.search);
const keywords = [];
for (let i = 1; i <= 3; i++) {
    const keyword = urlParams.get(`keyword${i}`);
    if (keyword) {
        keywords.push(keyword);
    }
}

//일치하는 키워드만 필터링
async function fetchSongs() {
    const response = await fetch('song.json');
    const data = await response.json();
    return data.songs;
}

async function filterSongsByAllKeywords(keywords) {
    const songs = await fetchSongs();
    return songs.filter(song => keywords.every(keyword => song.keywords.includes(keyword)));
}

async function filterSongsByAnyKeyword2Or3(keywords) {
    const songs = await fetchSongs();
    return songs.filter(song => keywords.some(keyword => song.keywords.includes(keyword)));
}

//키워드 출력
async function displayFilteredSongs() {
    const songDetail = document.getElementById("songDetail");
    const similarDetail = document.getElementById("similarDetail");
    const songDetailAlert = document.getElementById("songDetailAlert");
    
    songDetailAlert.style.display = "none";

    //완전 일치하는 노래
    const filteredSongs = await filterSongsByAllKeywords(keywords);
    const songListContainer = document.getElementById('songList');
    songListContainer.innerHTML = ""; 
    if (filteredSongs.length > 0) {
        songDetail.style.display = "block";

        filteredSongs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song-list', 'mb-3');
            songDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${song.cover}" alt="${song.title} 앨범 커버" srcset="" class="album" />
                <div style="margin-left: 10px;">
                    <span style="font-size: 18px;" class="bold">${song.title}</span>
                    <br />
                    <span style="font-size: 13px;">${song.album} · ${song.year}</span>
                </div>
            </div>
            <div style="margin-left: auto;">
                <button onclick="playVideoWithId('${song.id}', this)" class="play"><i class="fa-solid fa-play"></i></button>
            </div>
        `;        
            songListContainer.appendChild(songDiv);
        });
    } else {
        songDetail.style.display = "none";
        songDetailAlert.style.display = "block";
    }

    //비슷한 노래
    const filteredSongsByAnyKeyword2Or3 = await filterSongsByAnyKeyword2Or3(keywords.slice(1));
    const similarSongContainer = document.getElementById('similarSong');
    similarSongContainer.innerHTML = ""; 

    if (filteredSongsByAnyKeyword2Or3.length > 0) {
        similarDetail.style.display = "block";

        filteredSongsByAnyKeyword2Or3.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song-list', 'mb-3');
            songDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${song.cover}" alt="${song.title} 앨범 커버" srcset="" class="album" />
                <div style="margin-left: 10px;">
                    <span style="font-size: 18px;" class="bold">${song.title}</span>
                    <br />
                    <span style="font-size: 13px;">${song.album} · ${song.year}</span>
                </div>
            </div>
            <div style="margin-left: auto;">
                <button onclick="playVideoWithId('${song.id}', this)" class="play"><i class="fa-solid fa-play"></i></button>
            </div>
        `;        
            similarSongContainer.appendChild(songDiv);
        });
    } else {
        similarDetail.style.display = "none";
    }
    
    //갯수/시간 표시하는 부분
    const countSongs = document.getElementById("count");
    const countTime = document.getElementById("time");
    const value =  filteredSongsByAnyKeyword2Or3.length + filteredSongs.length;

    countSongs.innerHTML = value;

    //시간 계산
    const time = value * 3;
    if(time > 60) {
        const displayTime = Math.round(time / 60);
        countTime.innerHTML = displayTime + "시간";
    }else {
        countTime.innerHTML = time + "분";
    }
}

displayFilteredSongs(); 

//유튜브 영상 출력
let player;
let currentPlayerId; 

function refreshPage() {
    location.reload();
}

function playVideoWithId(videoId, button) {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = 'https://www.youtube.com/watch?v=' + videoId;
    } else {
        let isPlaying = false; 
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        function onPlayerReady(event) {
            event.target.setPlaybackQuality("small");
            player = event.target;
            button.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            currentPlayerId = button.id;
            isPlaying = true;
        }

        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
                isPlaying = true;
            } else {
                isPlaying = false;
            }
        }

        window.onYouTubeIframeAPIReady = function () {
            player = new YT.Player("player", {
                height: "0",
                width: "0",
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    loop: 1,
                    fs: 0,
                    cc_load_policy: 0,
                    iv_load_policy: 3,
                    autohide: 0,
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        };

        if (!/iPhone|iPod/.test(navigator.userAgent)) {
            button.onclick = refreshPage;
        }
    }
}
