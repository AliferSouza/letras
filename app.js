const form = document.querySelector('#form')
const serchInput = document.querySelector('#search')
const songContainer = document.querySelector('#songs-container')
const sorevNextContainer = document.querySelector('#prev-and-next-container')



const apiURL = 'https://api.lyrics.ovh'




const fatchData = async url => {
    const response = await fetch(url)
    return await response.json()
}


const getmoreSongs = async url => {
      const data = await fatchData(`https://cors-anywhere.herokuapp.com/${url}`)    
      insertSongsIntoPage(data)

}

const insertNextAndPrevButtos = ({ prev, next}) => {
    sorevNextContainer.innerHTML = `
    ${prev ? `<button class="btn" onclick="getmoreSongs('${prev}')">Anteriores</button>` : ''}
    ${next ? `<button class="btn" onclick="getmoreSongs('${next}')">Próximas</button>` : ''}
    `
    
}


const  insertSongsIntoPage = ({data, prev, next}) => {
// map = cria um novo array mais organizado
    songContainer.innerHTML = data.map(({artist: {name}, title}) => `
    <li class="song">
    <span class="song-artist"> <strong>${name}</strong> - ${title}</span>  
    <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>  
    </li>
    `).join('')
    
  

    if (prev || next ){     
        insertNextAndPrevButtos({prev, next}) 
        return       
    }
    sorevNextContainer.innerHTML = ''
}




const fatchSongs = async term => {
     const data = await fatchData(`${apiURL}/suggest/${term}`)    
     insertSongsIntoPage(data)
    }







const hadleFormSubmit = event => {
    event.preventDefault()
    // trim tira os espaços vazios
        const serchTerm = serchInput.value.trim()
    // para não enviar nada vazio
        if (!serchTerm){
            songContainer.innerHTML = `<li class="warning-message"> Por favor, digite um termo valido</li>`
    // Treturn vai ignora a funçao abaixo caso nçao tengha nada , para não fazer o else   
            return
        }
    // Tem dados entçao faz requisição
        fatchSongs(serchTerm)

}




form.addEventListener('submit', hadleFormSubmit )














const isertLyricsIntoPage = ({lyrics, artist, songTitle}) => {
    songContainer.innerHTML = `
    <li class="lyrics-container">
    <h2><strong>${songTitle}</strong> - ${artist}</h2>
    <p class=-"lyrics">${lyrics}</p>
    </li>
    `
}













const fatchLyrecs = async (artist, songTitle) => {
    const data = await  fatchData(`${apiURL}/v1/${artist}/${songTitle}`)
// replacesubstitui uma caractyer por outro   com filtros
    const lyrics  =  data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    isertLyricsIntoPage({ lyrics, artist, songTitle})
 
}









const hadleSongsContainerClick = event => {
    const clickedElemet = event.target

    if (clickedElemet.tagName === 'BUTTON') {
        const artist = clickedElemet.getAttribute('data-artist')
        const songTitle = clickedElemet.getAttribute('data-song-title')

        sorevNextContainer.innerHTML = ''

        fatchLyrecs(artist, songTitle)
    }

}




songContainer.addEventListener('click', hadleSongsContainerClick)











//console.log({form, serchInput, songContainer, sorevNextContainer})
