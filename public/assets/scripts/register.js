const API_URL = "http://localhost:3000/usuarios";

function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    var telefone = document.getElementById("telefone").value;
    const container = document.getElementById("checkRegister");
    const id = generateUUID();

    if (!telefone) {
        telefone = null;
    }

    if (!nome || !email || !senha) {
        container.innerHTML = `
                <div class="alert alert-danger mt-3" role="alert">
                    Preencha todos os campos
                </div>`;
        return;
    }

    try {
        // verifica se o email já existe
        const checkUser = await fetch(`${API_URL}?email=${email}`);
        const existing = await checkUser.json();

        if (existing.length > 0) {
            container.innerHTML = `
                <div class="alert alert-danger mt-3" role="alert">
                    Email já cadastrado
                </div>`;
            return;
        }

        // cadastra novo usuário
        const novoUsuario = {id, nome, email, senha, telefone };
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            sessionStorage.setItem("usuario", JSON.stringify(novoUsuario.id));
            container.innerHTML = `
                <div class="alert alert-success mt-3" role="alert">
                    Usuário criado com sucesso <i class="fa-solid fa-check"></i>
                </div>`;
            window.location.href = "../index.html";
        } else {
            container.innerHTML = `
                <div class="alert alert-danger mt-3" role="alert">
                    Erro ao criar usuário <i class="fa-solid fa-xmark"></i>
                </div>`;
        }
    } catch (err) {
        console.error("Erro de conexão:", err);
        alert("Erro ao conectar com o servidor.");
    }
});
