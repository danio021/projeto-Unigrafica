//barra de pesquisa//
document.getElementById("pesquisa").addEventListener("input", function() {
    var input = this.value.toLowerCase();
    var funcionarios = document.getElementsByClassName("funcionarios");
    for (var i = 0; i < funcionarios.length; i++) {
        var nome = funcionarios[i].getElementsByTagName("p")[0].innerText.toLowerCase();
        if (nome.includes(input)) {
            funcionarios[i].style.display = "block";
        } else {
            funcionarios[i].style.display = "none";
        }
    }
});
//barra de pesquisa//