const DADOS_URL = "http://localhost:3000/dados";
const META_URL = "http://localhost:3000/dadosMeta";

// ======== VERIFICA SE O USUÁRIO ESTÁ LOGADO ========
function checkIfLogged() {
    const userData = sessionStorage.getItem("usuario");
    if (!userData) {
        return false;
    }

    try {
        const userId = JSON.parse(userData);
        return !!userId;
    } catch (err) {
        console.error("Erro ao ler sessionStorage:", err);
        return false;
    }
}

function logout() {
    if (!confirm("Tem certeza que deseja sair?")) return;
    sessionStorage.removeItem("usuario");
    window.location.reload();
}

async function getUser() {
    let userId = sessionStorage.getItem("usuario");
    const container = document.getElementById("user");
    userId = JSON.parse(userId);
    let user = await fetch(`http://localhost:3000/usuarios/${userId}`);
    user = await user.json();
    let userName = user.nome.split(" ");
    container.innerHTML = (userName.length >= 1) ? `${userName[0]} ${userName[userName.length - 1]}` : `${userName[0]}`;
}

// ======== LISTAR AS 6 PRIMEIRAS ATIVIDADES ========
async function loadMainActivities() {
    const container = document.getElementById('activities-cards');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    try {
        const res = await fetch(`${DADOS_URL}`);
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user)
        const metaRes = await fetch(META_URL);
        const meta = await metaRes.json();
        atividades.sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
        for (i = 0; i < atividades.length && i < 6; i++) {
            const activity = atividades[i];
            var inicio = activity.date?.start?.slice(5, 13) || "";
            inicio = inicio.replace("T", " ");
            var fim = activity.date?.end?.slice(5, 13) || "";
            fim = fim.replace("T", " ");
            if (!activity.favorite) {
                container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
                    <a href="details.html?id=${activity.id}&category=${activity.category}">
                        <div class="activity-item activity-color">
                            <div class="activity-header row">
                                <div class="col">
                                    <i class="${meta[activity.category].icone}"></i>
                                    <span>${activity.category}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary border-0 col-2" 
                                    onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                                    <i class="fa-regular fa-star fa-lg"></i>
                                </button>
                                </div>
                            <p>${inicio}h | ${fim}h</p>
                        </div>
                    </a>
                </div>`;
            }
            else {
                container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
                    <a href="details.html?id=${activity.id}&category=${activity.category}">
                        <div class="activity-item activity-color">
                            <div class="activity-header row">
                                <div class="col">
                                    <i class="${meta[activity.category].icone}"></i>
                                    <span>${activity.category}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary border-0 col-2" 
                                    onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                                    <i class="fa-solid fa-star fa-lg"></i>
                                </button>
                                </div>
                            <p>${inicio}h | ${fim}h</p>
                        </div>
                    </a>
                </div>`;
            };
        };

        if (atividades.length > 6) {
            container.innerHTML += `
            <div class="col-12 text-center mt-3">
                <button id="btn-expandir" class="btn btn-primary">Ver mais</button>
            </div>`;
            document.getElementById('btn-expandir').addEventListener('click', loadAllActivities);
        }

    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar atividades.</p>";
        console.error(err);
    }
}

// ======== CARREGAR TODAS AS ATIVIDADES ========
async function loadAllActivities() {
    const container = document.getElementById('activities-cards');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    try {
        const res = await fetch(`${DADOS_URL}`);
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user)
        const metaRes = await fetch(META_URL);
        const meta = await metaRes.json();

        container.innerHTML = "";
        atividades.sort((a, b) => new Date(a.date.start) - new Date(b.date.start));
        atividades.forEach(activity => {
            var inicio = activity.date?.start?.slice(5, 13) || "";
            inicio = inicio.replace("T", " ");
            var fim = activity.date?.end?.slice(5, 13) || "";
            fim = fim.replace("T", " ");
            if (!activity.favorite) {
                container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
                    <a href="details.html?id=${activity.id}&category=${activity.category}">
                        <div class="activity-item activity-color">
                            <div class="activity-header row">
                                <div class="col">
                                    <i class="${meta[activity.category].icone}"></i>
                                    <span>${activity.category}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary border-0 col-2" 
                                    onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                                    <i class="fa-regular fa-star fa-lg"></i>
                                </button>
                                </div>
                            <p>${inicio}h | ${fim}h</p>
                        </div>
                    </a>
                </div>`;
            }
            else {
                container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
                    <a href="details.html?id=${activity.id}&category=${activity.category}">
                        <div class="activity-item activity-color">
                            <div class="activity-header row">
                                <div class="col">
                                    <i class="${meta[activity.category].icone}"></i>
                                    <span>${activity.category}</span>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary border-0 col-2" 
                                    onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                                    <i class="fa-solid fa-star fa-lg"></i>
                                </button>
                                </div>
                            <p>${inicio}h | ${fim}h</p>
                        </div>
                    </a>
                </div>`;
            }
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar atividades.</p>";
        console.error(err);
    }
}

// ======== PESQUISAR ITENS ========
async function searchItems(text) {
    const container = document.getElementById('activities-cards');
    let user = JSON.parse(sessionStorage.getItem("usuario"));
    container.innerHTML = "";

    // se busca vazia → volta ao padrão
    if (text.trim() === "") {
        loadMainActivities();
        return;
    }

    // sempre limpar antes de renderizar (evita duplicados)

    const res = await fetch(DADOS_URL);
    const resJson = await res.json();
    const atividades = resJson.filter(a => a.user_id === user);

    const meta = await (await fetch(META_URL)).json();

    // busca apenas por title
    const filtered = atividades.filter(a =>
        a.title.toLowerCase().includes(text.toLowerCase())
    );

    filtered.forEach(activity => {
        const inicio = (activity.date?.start || "").slice(5, 13).replace("T", " ");
        const fim = (activity.date?.end || "").slice(5, 13).replace("T", " ");
        const starClass = activity.favorite ? "fa-solid" : "fa-regular";

        container.innerHTML += `
        <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
            <a href="details.html?id=${activity.id}&category=${activity.category}">
                <div class="activity-item activity-color">
                    <div class="activity-header row">
                        <div class="col">
                            <i class="${meta[activity.category].icone}"></i>
                            <span>${activity.category}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-secondary border-0 col-2"
                            onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                            <i class="${starClass} fa-star fa-lg"></i>
                        </button>
                    </div>
                    <p>${inicio}h | ${fim}h</p>
                </div>
            </a>
        </div>`;
    });
}

// ======== CARREGAR TODAS AS ATIVIDADES FAVORITAS ========
async function loadFavoriteActivities() {
    const container = document.getElementById('favorite-items');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    try {
        const res = await fetch(`${DADOS_URL}`);
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user && a.favorite == true)
        const metaRes = await fetch(META_URL);
        const meta = await metaRes.json();

        container.innerHTML = "";
        atividades.forEach(activity => {
            var inicio = activity.date?.start?.slice(5, 13) || "";
            inicio = inicio.replace("T", " ");
            var fim = activity.date?.end?.slice(5, 13) || "";
            fim = fim.replace("T", " ");
            container.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-6 card-style-content">
                    <a href="details.html?id=${activity.id}&category=${activity.category}">
                        <div class="card-style-content">
                            <div class="appointment-info">
                                <div class="appointment-icon">
                                    <i class="${meta[activity.category].icone} fa-xl"></i>
                                </div>
                                <div class="appointment-details">
                                    <div class="activity-header row">
                                        <div class="col-9">
                                            <h4>${activity.title}</h4>
                                        </div>
                                        <button class="btn btn-sm btn-outline-secondary border-0 col-2" 
                                        onclick="event.preventDefault(); event.stopPropagation(); setFavorite(${activity.id})">
                                        <i class="fa-solid fa-star fa-lg"></i>
                                        </button>
                                    </div>
                                    <p class="appointment-time">${inicio} | ${fim}</p>
                                    <p class="appointment-desc">${activity.category} - ${activity.local}</p>
                                    <p class="appointment-desc">${activity.description}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`;
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar atividades.</p>";
        console.error(err);
    }
}

// ======== PRÓXIMO COMPROMISSO ========
async function getNextAppointment() {
    const container = document.getElementById('next-appointment');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    try {
        const res = await fetch(`${DADOS_URL}`);
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user)
        const metaRes = await fetch(META_URL);
        const meta = await metaRes.json();
        const today = new Date();

        let nextActivity = null;
        let mindate = null;

        atividades.forEach(activity => {
            const start = new Date(activity.date.start);
            if (!mindate && start >= today || start < mindate && start >= today) {
                mindate = start;
                nextActivity = activity;
            }
        });

        if (!nextActivity) {
            container.innerHTML = "<p>Não há próximos compromissos.</p>";
            return;
        }

        var inicio = nextActivity.date.start.slice(5, 16);
        inicio = inicio.replace("T", " ");
        var fim = nextActivity.date.end.slice(5, 16);
        fim = fim.replace("T", " ");

        container.innerHTML = `
            <a href="details.html?id=${nextActivity.id}&category=${nextActivity.category}">
                <header class="card-style-header">
                    <h3 class="card-style-title">
                        <i class="fa-regular fa-clock"></i> Próximo Compromisso
                    </h3>
                </header>
                <div class="card-style-content">
                    <div class="appointment-info">
                        <div class="appointment-icon">
                            <i class="${meta[nextActivity.category].icone} fa-xl"></i>
                        </div>
                        <div class="appointment-details">
                            <h4>${nextActivity.title}</h4>
                            <p class="appointment-time">${inicio} | ${fim}</p>
                            <p class="appointment-desc">${nextActivity.category} - ${nextActivity.local}</p>
                        </div>
                    </div>
                </div>
            </a>`;
    } catch (err) {
        container.innerHTML = "<p>Erro ao buscar compromissos.</p>";
        console.error(err);
    }
}

// ======== TOTAL DE ATIVIDADES ========
async function totalActivities() {
    const container = document.getElementById('stats-number');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    try {
        const res = await fetch(`${DADOS_URL}`);
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user)
        container.innerHTML = atividades.length;
    } catch (err) {
        container.innerHTML = "-";
        console.error(err);
    }
}

// ======== DETALHE OU PRÓXIMA ATIVIDADE POR CATEGORIA ========
async function getActivity() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const category = params.get('category');
    const tela = document.getElementById('next-appointment');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);

    try {
        if (id) {
            const res = await fetch(`${DADOS_URL}/${id}`);
            const activity = await res.json();

            if (!activity || !activity.id) {
                tela.innerHTML = "<p>Atividade não encontrada.</p>";
                return;
            }

            tela.innerHTML = `
                <header class="card-style-header header-with-delete">
                    <h3 class="card-style-title">
                        Próxima Atividade da categoria - ${activity.category}
                        <button class="btn btn-sm btn-outline-primary border-0 edit-btn" onclick="editActivity(${activity.id})">
                        <i class="fa-solid fa-pen fa-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger border-0 delete-btn" onclick="deleteActivity(${activity.id})">
                        <i class="fa-solid fa-xmark fa-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary border-0 favorite-btn" onclick="setFavorite(${activity.id})">
                        <i class="fa-${(activity.favorite) ? "solid" : "regular"} fa-star fa-lg"></i>
                        </button>
                    </h3>
                    </header>
                <div class="card-style-content" id="activity-${activity.id}">
                    <div class="appointment-info">
                        <div class="appointment-icon">
                            <img src="./assets/img/${activity.category}.png" class="appointment-image">
                        </div>
                        <div class="appointment-details">
                            <h4>${activity.title}</h4>
                            <p class="appointment-time">${activity.date.start} | ${activity.date.end}</p>
                            <p class="appointment-desc"><i class="fa-solid fa-location-dot"></i> ${activity.local}</p>
                            <p class="appointment-desc">${activity.description}</p>
                        </div>
                    </div>
                </div>`;
        } else if (category) {
            const res = await fetch(`${DADOS_URL}?category=${category}`);
            const resJson = await res.json();
            const atividades = resJson.filter(a => a.user_id === user)

            if (atividades.length === 0) {
                tela.innerHTML = "<p>Não há atividades nessa categoria.</p>";
                return;
            }

            let nextActivity = atividades.reduce((min, act) =>
                new Date(act.date.start) < new Date(min.date.start) ? act : min
            );

            tela.innerHTML = `
                <header class="card-style-header header-with-delete">
                    <h3 class="card-style-title">
                        Próxima Atividade da Categoria - ${nextActivity.category}
                        <button class="btn btn-sm btn-outline-primary border-0 edit-btn" onclick="editActivity(${nextActivity.id})">
                        <i class="fa-solid fa-pen fa-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger border-0 delete-btn" onclick="deleteActivity(${nextActivity.id})">
                        <i class="fa-solid fa-xmark fa-lg"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary border-0 favorite-btn" onclick="setFavorite(${nextActivity.id})">
                        <i class="fa-${(nextActivity.favorite) ? "solid" : "regular"} fa-star fa-lg"></i>
                        </button>
                    </h3>
                    </header>
                <div class="card-style-content" id="activity-${nextActivity.id}">
                    <div class="appointment-info">
                        <div class="appointment-icon">
                            <img src="./assets/img/${nextActivity.category}.png" class="appointment-image">
                        </div>
                        <div class="appointment-details">
                            <h4>${nextActivity.title}</h4>
                            <p class="appointment-time">${nextActivity.date.start} | ${nextActivity.date.end}</p>
                            <p class="appointment-desc"><i class="fa-solid fa-location-dot"></i> ${nextActivity.local}</p>
                            <p class="appointment-desc">${nextActivity.description}</p>
                        </div>
                    </div>
                </div>`;
        }
    } catch (err) {
        tela.innerHTML = "<p>Erro ao carregar atividade.</p>";
        console.error(err);
    }
}

// ======== CARROSSEL DE CATEGORIAS ========
async function carouselItemsByCategory() {
    const container = document.getElementById('carousel-categories');
    try {
        const res = await fetch(META_URL);
        const categorys = await res.json();
        container.innerHTML = "";

        Object.keys(categorys).forEach(cat => {
            container.innerHTML += `
                <div class="carousel-item">
                    <article class="card-style next-appointment">
                        <a href="details.html?category=${cat}">
                            <header class="card-style-header">
                                <h3 class="card-style-title">
                                    <i class="fa-solid fa-bars"></i> Categorias
                                </h3>
                            </header>
                            <div class="card-style-content">
                                <div class="appointment-info">
                                    <div class="appointment-icon">
                                        <i class="${categorys[cat].icone} fa-xl"></i>
                                    </div>
                                    <div class="appointment-details">
                                        <h4>${cat}</h4>
                                        <p class="appointment-desc">${categorys[cat].description}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </article>
                </div>`;
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar categorias.</p>";
        console.error(err);
    }
}

// ======== CARREGA ATIVIDADES DE UMA CATEGORIA ========
async function loadActivitiesByCategory() {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);

    const container = document.getElementById('activities-cards');
    container.innerHTML = "<p>Carregando...</p>";

    if (!category) {
        container.innerHTML = "<p>Categoria não informada.</p>";
        return;
    }

    try {
        const res = await fetch(`${DADOS_URL}?category=${category}`);
        const metaRes = await fetch(META_URL);
        const meta = await metaRes.json();
        if (!res.ok) throw new Error('Erro ao buscar atividades por categoria');
        const resJson = await res.json();
        const atividades = resJson.filter(a => a.user_id === user)

        if (!atividades || atividades.length === 0) {
            container.innerHTML = "<p>Não há atividades nesta categoria.</p>";
            return;
        }

        atividades.sort((a, b) => new Date(a.date.start) - new Date(b.date.start));

        container.innerHTML = "";
        atividades.forEach(activity => {
            const inicio = activity.date?.start ? activity.date.start.slice(5, 16) : "";
            const fim = activity.date?.end ? activity.date.end.slice(5, 16) : "";

            container.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-4 card-style-content" id="${activity.id}">
                <a href="details.html?id=${activity.id}&category=${activity.category}">
                    <div class="activity-item activity-color">
                        <div class="activity-header">
                            <i class="${meta[activity.category].icone}"></i>
                            <span class="text">${activity.category}</span>
                        </div>
                        <p>${inicio} | ${fim}</p>
                    </div>
                </a>
            </div>`;
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar atividades.</p>";
        console.error(err);
    }
}

// ======== CRIA OPÇÕES COM AS CATEGORIA ========
async function optionsByCategory() {
    const container = document.getElementById("category");
    const res = await fetch(META_URL)
    const categorys = await res.json();
    Object.keys(categorys).forEach(cat => {
        container.innerHTML += `
            <option value="${cat}">${cat}</option>
        `;
    });
}

// ======== CRIA UMA NOVA ATIVIDADE ========
async function createNewActivity() {
    const container = document.getElementById("content");
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const local = document.getElementById("local").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    let user_id = sessionStorage.getItem("usuario");
    user_id = JSON.parse(user_id);

    try {
        const response = await fetch(DADOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "title": title,
                "description": description,
                "date": {
                    "start": start,
                    "end": end
                },
                "local": local,
                "category": category,
                "favorite": false,
                "user_id": user_id
            })
        });

        if (response.ok) {
            container.innerHTML += `
                <div class="alert alert-success mt-3" role="alert">
                    Atividade criada com sucesso <i class="fa-solid fa-check"></i>
                </div>`;
        }
        else {
            container.innerHTML = `
                <div class="alert alert-danger mt-3" role="alert">
                    Erro ao criar atividade <i class="fa-solid fa-xmark"></i>
                </div>`;
        }
    }
    catch (err) {
        console.error("Erro de conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

// ======== DELETA UMA ATIVIDADE EXISTENTE ========
async function deleteActivity(id) {
    if (!confirm("Tem certeza que deseja excluir esta atividade?")) return;

    try {
        const res = await fetch(`${DADOS_URL}/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            alert("Atividade excluída com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Erro ao excluir atividade.");
        }
    } catch (err) {
        console.error("Erro na exclusão:", err);
        alert("Erro ao conectar com o servidor.");
    }
}

// ======== HABILITA EDIÇÃO DE UM EVENTO EXISTENTE ========
async function editActivity(id) {
    const container = document.getElementById(`activity-${id}`);
    const title = container.querySelector("h4").textContent;
    const [start, end] = container.querySelector(".appointment-time").textContent.split("|").map(v => v.trim());
    const local = container.querySelectorAll(".appointment-desc")[0].textContent.replace("📍", "").trim();
    const desc = container.querySelectorAll(".appointment-desc")[1].textContent.trim();

    container.innerHTML = `
    <div class="appointment-details w-100">
      <input id="edit-title-${id}" class="form-control mb-2" value="${title}">
      <div class="row g-2">
        <div class="col"><input type="datetime-local" id="edit-start-${id}" class="form-control" value="${start}"></div>
        <div class="col"><input type="datetime-local" id="edit-end-${id}" class="form-control" value="${end}"></div>
      </div>
      <input id="edit-local-${id}" class="form-control mt-2 mb-2" value="${local}">
      <textarea id="edit-desc-${id}" class="form-control mb-2">${desc}</textarea>
      <button class="btn btn-success w-100" onclick="saveActivity(${id})">Salvar</button>
    </div>
  `;
}

// ======== SALVA A EDIÇÃO DO EVENTO EDITADO ========
async function saveActivity(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const start = document.getElementById(`edit-start-${id}`).value;
    const end = document.getElementById(`edit-end-${id}`).value;
    const local = document.getElementById(`edit-local-${id}`).value;
    const description = document.getElementById(`edit-desc-${id}`).value;

    try {
        const res = await fetch(`${DADOS_URL}/${id}`);
        const atual = await res.json();

        const atualizado = {
            ...atual,
            title: title,
            description,
            local,
            date: {
                ...atual.date,
                start,
                end
            }
        };

        const put = await fetch(`${DADOS_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizado)
        });

        if (put.ok) {
            window.location.href = "index.html";
        } else {
            alert("Erro ao salvar alterações.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
}

// ======== ALTERA O STATUS DE FAVORITO ========
async function setFavorite(id) {
    try {
        const res = await fetch(`${DADOS_URL}/${id}`);
        const atual = await res.json();

        const atualizado = {
            ...atual,
            favorite: !atual.favorite
        };

        const put = await fetch(`${DADOS_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizado)
        });

        if (put.ok) {
            window.location.reload();
        } else {
            alert("Erro ao salvar alterações.");
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão.");
    }
}

// ======== FILTRA OS EVENTOS A SEREM EXIBIDOS NO CALENDÁRIO ========
async function filterEvents(type) {
    const container = document.querySelector(`.${type}`);
    container.id = "active-item";
    const response = await fetch(DADOS_URL);
    const resJson = await response.json();
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    const data = resJson.filter(a => a.user_id === user)

    let filteredData = [];

    if (type === "work") {
        filteredData = data.filter(a => a.category === "Trabalho");
    }
    else if (type === "personal") {
        filteredData = data.filter(a =>
            a.category === "Saude" ||
            a.category === "Atividade Fisica" ||
            a.category === "Lazer"
        );
    }
    else if (type === "study") {
        filteredData = data.filter(a => a.category === "Estudo");
    }
    else {
        filteredData = [...data];
    }

    return filteredData.map(item => ({
        title: item.title,
        start: item.date.start,
        end: item.date.end,
        description: item.description,
        category: item.category,
        local: item.local
    }));
}

// ======== CRIA O CALENDÁRIO ========
async function createCalendar() {
    const params = new URLSearchParams(location.search);
    const id = params.get('type');
    const events = await filterEvents(id);
    const calendarElement = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarElement, {
        events: events,
        headerToolbar: {
            left: 'prev,next today',
            center: '',
            right: 'title'
        },
        eventClick: function (info) {
            alert(
                "Evento: " + info.event.title +
                "\n\nCategoria: " + info.event.extendedProps.category +
                "\n\nInício: " + info.event.start +
                "\n\nFim: " + info.event.end +
                "\n\nDescrição: " + info.event.extendedProps.description +
                "\n\nLocal: " + info.event.extendedProps.local
            );
        }
    });

    calendar.render();
}

// ======== BUSCA A DATA DA SEGUNDA-FEIRA DA SEMANA ATUAL ========
function getCurrentMonday() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);

    return monday;
}

// ======== BUSCA A DATA DOS DIAS DA SEMANA ATUAL ========
function getWeekDates() {
    const start = getCurrentMonday();
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

    const dates = days.map((day, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return {
            label: day,
            date: d.toISOString().split("T")[0]
        };
    });

    return dates;
}

// ======== FILTRA OS EVENTOS CONFORME A DATA ========
function filterEventsByDate(events, targetDate) {
    return events.filter(ev => {
        const eventDate = ev.date.start.split("T")[0];
        return eventDate === targetDate;
    });
}

// ======== BUSCA OS EVENTOS CONFORME AS DATAS FORNECIDAS ========
async function fetchWeekValues(dates) {
    let user = sessionStorage.getItem("usuario");
    user = JSON.parse(user);
    const response = await fetch(DADOS_URL);
    const resJson = await response.json();
    const allEvents = resJson.filter(a => a.user_id === user)

    const values = dates.map(d => {
        const filtered = allEvents.filter(ev => {
            const evDate = ev.date.start.split("T")[0];
            return evDate === d.date;
        });

        return filtered.length;
    });

    return values;
}

// ======== CRIA UM GRÁFICO COM OS EVENTOS FORNECIDOS ========
async function listWeekEvents() {
    const weekData = getWeekDates();
    const labels = weekData.map(d => d.label);
    const values = await fetchWeekValues(weekData);

    const cores = ["#00c4d6", "#2980ff", "#2664d9", "#0047ff", "#a463f2"];

    new Chart(document.getElementById("weekChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: cores,
                borderRadius: 20,
                barThickness: 22
            }]
        },
        options: {
            indexAxis: "y",
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: "end",
                    align: "right",
                    color: "#333",
                    font: { weight: "bold" },
                    formatter: v => v
                }
            },
            scales: {
                x: { beginAtZero: true, grid: { display: false } },
                y: { grid: { display: false } }
            }
        },
        plugins: [ChartDataLabels]
    });
}