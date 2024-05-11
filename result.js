const urlParams = new URLSearchParams(window.location.search);
const keywords = [];
for (let i = 1; i <= 3; i++) {
    const keyword = urlParams.get(`keyword${i}`);
    if (keyword) {
        keywords.push(keyword);
    }
}

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

async function displayFilteredSongs() {
    const songDetail = document.getElementById("songDetail");
    const similarDetail = document.getElementById("similarDetail");
    const songDetailAlert = document.getElementById("songDetailAlert");
    
    songDetailAlert.style.display = "none";

    const filteredSongs = await filterSongsByAllKeywords(keywords);
    const songListContainer = document.getElementById('songList');
    songListContainer.innerHTML = ""; 
    if (filteredSongs.length > 0) {
        songDetail.style.display = "block";

        filteredSongs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song-list', 'mb-3');
            songDiv.innerHTML = `
                <img src="${song.cover}" alt="${song.title} 앨범 커버" srcset="" class="album" />
                &nbsp; &nbsp;
                <span>
                    <span style="font-size: 18px" class="bold">${song.title}</span>
                    <br />
                    <span style="font-size: 13px">${song.album} · ${song.year}</span>
                </span>
            `;
            songListContainer.appendChild(songDiv);
        });
    } else {
        songDetail.style.display = "none";
        songDetailAlert.style.display = "block";
    }

    const filteredSongsByAnyKeyword2Or3 = await filterSongsByAnyKeyword2Or3(keywords.slice(1));
    const similarSongContainer = document.getElementById('similarSong');
    similarSongContainer.innerHTML = ""; 

    if (filteredSongsByAnyKeyword2Or3.length > 0) {
        similarDetail.style.display = "block";

        filteredSongsByAnyKeyword2Or3.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song-list', 'mb-3');
            songDiv.innerHTML = `
                <img src="${song.cover}" alt="${song.title} 앨범 커버" srcset="" class="album" />
                &nbsp; &nbsp;
                <span>
                    <span style="font-size: 18px" class="bold">${song.title}</span>
                    <br />
                    <span style="font-size: 13px">${song.album} · ${song.year}</span>
                </span>
            `;
            similarSongContainer.appendChild(songDiv);
        });
    } else {
        similarDetail.style.display = "none";
    }
    
    const countSongs = document.getElementById("count");
    const countTime = document.getElementById("time");
    const value =  filteredSongsByAnyKeyword2Or3.length + filteredSongs.length;

    countSongs.innerHTML = value;

    const time = value * 3;
    if(time > 60) {
        const displayTime = Math.round(time / 60);
        countTime.innerHTML = displayTime + "시간";
    }else {
        countTime.innerHTML = time + "분";
    }
}

displayFilteredSongs();