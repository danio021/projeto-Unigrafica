
    function exibirImagem(event) {
      const arquivo = event.target.files[0];
      const preview = document.getElementById('previewImg');
      const botao = document.querySelector('.botao-upload');

      if (arquivo) {
        // Cria uma URL temporária para a imagem
        preview.src = URL.createObjectURL(arquivo);
        
        // Esconde o botão e mostra a imagem
        botao.style.display = 'none';
        preview.style.display = 'block';
      }
    }
