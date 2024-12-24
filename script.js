// 1. Definição da URL inicial e variáveis globais
let currentPageUrl = 'https://rickandmortyapi.com/api/character';

// Responsabilidade: Define a URL base da API para buscar os dados da primeira página de personagens.
// Uso futuro: Essa variável é usada ao carregar novos dados (próxima ou anterior página) e ao inicializar a aplicação.

// 2) Funções auxiliares para formatação ou tradução de dados - São chamadas na montagem dos detalhes do personagem no modal.
function convertStatus(status) {
    const characterStatus = {
        alive: "vivo",
        dead: "morto",
        unknown: "desconhecido",
      };
    
      return characterStatus[status.toLowerCase()] || status;
}


function convertSpecies(species) {
    const characterSpecies = {
        human: "humano",
        alien: "alienígena",
        humanoid: "humanoide",
        "mythological creature": "criatura mitológica",
        disease: 'doença',
        robot: "robô",
        unknown: "desconhecida",
      };
    
      return characterSpecies[species.toLowerCase()] || species;
}

function convertGender(gender) {
    const characterGender = {
        male: "macho",
        female: "fêmea",
        unknown: "desconhecido",
      };
    
      return characterGender[gender.toLowerCase()] || gender;
}

// Objetivo: Fecha o modal ao clicar fora dele
function hideModal() {
  const modal = document.getElementById("modal");
  modal.style.visibility = "hidden";
}

// 3) Funções principais
// a) Carregar personagens da API
async function loadCharacters(url) {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = ''; // Limpa resultados anteriores

  try {
    const response = await fetch(url);
    const responseJson = await response.json();

    //   Responsabilidade:
    // Limpar conteúdo anterior: Garante que os personagens carregados anteriormente não sejam duplicados.
    // Buscar dados da API: Faz a requisição para a URL fornecida.
    // Converter resposta: Transforma os dados brutos da API em um formato manipulável (JSON).

    // Renderizar cada personagem no DOM
    responseJson.results.forEach((character) => {
      const card = document.createElement("div");
      card.style.backgroundImage = `url(${character.image})`;
      card.className = "cards";
    //   Objetivo:
    //   Criar dinamicamente elementos div que representam os personagens como cards.
    //   Configurar a imagem de fundo do card com base no ID do personagem extraído da URL da API.

      // Criar nome do personagem - Adicionar o nome do personagem ao card, estilizado com elementos HTML e classes CSS
      const characterNameBG = document.createElement("div");
      characterNameBG.className = "character-name-bg";

      const characterName = document.createElement("span");
      characterName.className = "character-name";
      characterName.innerText = `${character.name}`;

      characterNameBG.appendChild(characterName);
      card.appendChild(characterNameBG);

    // Configurar clique para abrir modal - Adicionar funcionalidade de abrir modal
    // Configurar um evento onclick para exibir um modal ao clicar no card.
    // Garante que o conteúdo do modal seja atualizado para o personagem específico.
      card.onclick = () => {
        const modal = document.getElementById("modal");
        modal.style.visibility = "visible";
        const modalContent = document.getElementById("modal-content");
        modalContent.innerHTML = '';

        const characterImage = document.createElement("div");
        characterImage.style.backgroundImage = `url(${character.image})`;
        characterImage.className = "character-image";

        // Inserir detalhes do personagem no modal
        // Detalhes exibidos: Nome, altura, peso, cor dos olhos e ano de nascimento.
        // Usa funções auxiliares (convertEyeColor, convertHeight, etc.) para formatar os dados.

        const name = document.createElement("span");
        name.className = "character-details";
        name.innerText = `Nome: ${character.name}`;

        const characterStatus = document.createElement("span");
        characterStatus.className = "character-details";
        characterStatus.innerText = `Status: ${convertStatus(character.status)}`;

        const species = document.createElement("span");
        species.className = "character-details";
        species.innerText = `Espécie: ${convertSpecies(character.species)}`;

        const gender = document.createElement("span");
        gender.className = "character-details";
        gender.innerText = `Gênero: ${convertGender(character.gender)}`;

        const origin = document.createElement("span");
        origin.className = "character-details";
        origin.innerText = `Origem: ${character.origin.name === "unknown" ? "desconhecida" : character.origin.name}`;

        modalContent.appendChild(characterImage);
        modalContent.appendChild(name);
        modalContent.appendChild(characterStatus);
        modalContent.appendChild(species);
        modalContent.appendChild(gender);
        modalContent.appendChild(origin);
      };

      // Adicionar card ao container principal
      mainContent.appendChild(card);
    });

    // Gerenciar navegação entre páginas
    // Configurar botões de navegação - Se não houver próxima página, desativa o botão Próximo.
    // Se não houver página anterior, desativa ou oculta o botão Voltar.
    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');
    nextButton.disabled = !responseJson.info.next;
    backButton.disabled = !responseJson.info.prev;
    backButton.style.visibility = responseJson.info.prev ? "visible" : "hidden";

    currentPageUrl = url; // Atualiza a URL atual
  } catch (error) {
    throw new Error('Erro ao carregar personagens');
  }
}

// b) Funções de navegação entre páginas (def)
// Responsabilidade: Atualizar o currentPageUrl e chamar loadCharacters com a próxima ou a página anterior.
// Reutiliza loadCharacters para exibir os novos dados
async function loadNextPage() {
  if (!currentPageUrl) return;

  try {
    const response = await fetch(currentPageUrl);
    const responseJson = await response.json();

    await loadCharacters(responseJson.info.next);
  } catch (error) {
    console.log(error);
    alert('Erro ao carregar a próxima página');
  }
}

async function loadPreviousPage() {
  if (!currentPageUrl) return;

  try {
    const response = await fetch(currentPageUrl);
    const responseJson = await response.json();

    await loadCharacters(responseJson.info.prev);
  } catch (error) {
    console.log(error);
    alert('Erro ao carregar a página anterior');
  }
}

// 4) Configuração de eventos e Inicialização da página ao carregar
// Propósito: Configurar os eventos iniciais ao carregar a página e os eventos de clique nos botões Próximo e Volta:
window.onload = async () => {
  try {
    await loadCharacters(currentPageUrl);
  } catch (error) {
    console.log(error);
    alert('Erro ao carregar cards');
  }

  const nextButton = document.getElementById('next-button');
  nextButton.addEventListener('click', loadNextPage);

  const backButton = document.getElementById('back-button');
  backButton.addEventListener('click', loadPreviousPage);
};
