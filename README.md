# **The Bokki**

> **Seus cadernos digitais, do seu jeito.**

The Bokki é um aplicativo de cadernos digitais para desktop que combina a liberdade de um caderno físico com os recursos de um editor de texto e a organização visual de uma tela livre.

O projeto nasceu da ideia de reunir duas experiências que muitas ferramentas digitais acabam separando: a produtividade da organização digital e a liberdade de personalizar um caderno. Tudo isso em um aplicativo local e personalizável.

A proposta é funcionar **offline, diretamente no computador do usuário**, com suporte para **Windows e Linux**, sem depender de uma conta na nuvem para armazenar os cadernos e anotações.

## **✨ Conceito**

O The Bokki é construído em torno da ideia de uma **estante digital de cadernos pessoais**.

Cada caderno pode ter sua própria capa, páginas, aparência e conteúdo. Dentro das páginas, o usuário poderá escrever com formatação avançada, posicionar caixas de texto livremente, adicionar figurinhas e outros elementos visuais, além de marcar páginas importantes com marcadores.

O conceito reúne referências de diferentes ferramentas e objetos:

- **Cadernos físicos** — páginas, capas, marcadores e personalização.
- **OneNote** — elementos de conteúdo que podem ser posicionados livremente.
- **Obsidian / Markdown** — estruturação de texto e portabilidade.
- **Editores de texto** — negrito, itálico, cores, destaques e listas.
- **Papelaria digital** — figurinhas, decorações, temas e personalização visual.

A proposta é oferecer uma experiência que se pareça mais com um caderno do que com um painel convencional de produtividade.

## **📚 Funcionalidades planejadas**

⚠️As funcionalidades abaixo representam a visão do produto, como se espera que o produto seja no futuro, e não necessariamente estarão disponíveis nas primeiras versões.⚠️

### **📖 Cadernos**

- Criar múltiplos cadernos.
- Definir um nome para cada caderno.
- Personalizar as capas.
- Abrir cadernos em uma interface interativa inspirada em livros.
- Navegar entre páginas.
- Personalizar a aparência das folhas.
- Suportar páginas longas, que crescem verticalmente conforme a escrita.

### **✍️ Edição de texto**

Cada área de texto funcionará como um editor de texto rico, com recursos como:

- Negrito, itálico, sublinhado e tachado.
- Cores e destaques no texto.
- Títulos e subtítulos.
- Listas com marcadores e numeradas.
- Listas de tarefas.
- Citações e blocos de código.
- Código em linha.
- Links.

Novos recursos poderão ser adicionados conforme a evolução do editor.

### **🖱️ Elementos posicionáveis**

Em vez de tratar cada página como um documento de texto contínuo, a proposta é transformá-la em um espaço de composição visual, com elementos independentes.

Entre eles:

- Caixas de texto.
- Figurinhas.
- Imagens.
- Elementos decorativos.
- Outros elementos personalizados no futuro.

Cada elemento poderá ter sua própria posição e propriedades visuais, permitindo maior liberdade na organização das páginas.

### **🎀 Figurinhas e decorações**

As figurinhas serão uma das principais características visuais do The Bokki.

O sistema prevê:

- Coleção inicial de figurinhas incluída no aplicativo.
- Pacotes de figurinhas.
- Diferentes tipos de figurinhas em cada pacote.
- Posicionamento livre nas páginas.
- Redimensionamento e rotação.
- Reutilização enquanto houver unidades disponíveis no inventário.
- Futuramente, elementos decorativos como washi tapes e outros itens de papelaria.

### **🔖 Marcadores de páginas**

Será possível marcar páginas importantes com marcadores personalizáveis, contendo:

- Referência da página.
- Cor.
- Nome ou etiqueta.
- Posição visual.

Os marcadores acompanharão a navegação pelo caderno. Por exemplo, ao acessar a página 10, um marcador da página 5 aparecerá no lado esquerdo, enquanto um da página 20 ficará à direita.

Ao avançar para a página 30, o marcador da página 20 passará automaticamente para o lado esquerdo, acompanhando sua posição em relação à página atual.

### **📝 Anotações rápidas**

A tela inicial contará com uma área dedicada a pequenas anotações e lembretes.

A proposta é oferecer:

- Anotações curtas.
- Itens marcáveis.
- Criação rápida.
- Acesso direto pela tela inicial.

Assim, será possível registrar pensamentos e lembretes sem precisar abrir um caderno.

### **🪙 Recompensas diárias**

Uma versão futura contará com um sistema de moedas virtuais utilizadas na loja de figurinhas.

O ciclo de recompensas terá dez dias consecutivos de acesso:

- Dia 1 → recompensa.
- Dia 2 → recompensa.
- Dia 3 → recompensa.
- ...
- Dia 10 → recompensa.
- Dia 11 → reinício do ciclo no Dia 1.

A sequência será baseada nos dias consecutivos em que o usuário abrir o aplicativo. Caso o intervalo necessário não seja cumprido, o ciclo será reiniciado.

### **🛍️ Loja de figurinhas**

Uma versão futura contará com uma loja integrada, na qual será possível utilizar as moedas virtuais do The Bokki.

O usuário poderá:

- Explorar pacotes de figurinhas.
- Visualizar o conteúdo de cada pacote.
- Comprar pacotes utilizando moedas.
- Receber unidades de figurinhas após a compra.
- Consultar as quantidades disponíveis no inventário.

**Exemplo de pacote:**

**Cute Pack**

Preço do pacote

**10 🪙**

🐰 Coelhinho\
**×3**

🎀 Laço\
**×3**

🌸 Flor\
**×3**

Ao posicionar uma figurinha de coelhinho em uma página, o inventário será atualizado:

- 🐰 Coelhinho ×2
- 🎀 Laço ×3
- 🌸 Flor ×3

Após utilizar as três unidades de coelhinho, será necessário adquirir outro pacote para obter mais.

## **🛠️ Tecnologias planejadas**

### **Frontend**

- Angular
- TypeScript
- HTML
- Tailwind CSS

**Angular:** framework utilizado para desenvolver a interface e os componentes da aplicação.

**Tailwind CSS:** framework CSS baseado em classes utilitárias para estilização da interface.

### **Desktop**

- Tauri 2
- Rust

**Tauri 2:** framework responsável por empacotar o frontend Angular como uma aplicação desktop nativa.

**Rust:** utilizado pelo Tauri para funcionalidades nativas e integração com o sistema operacional.

### **Banco de dados**

\- SQLite

Será utilizado como banco de dados local para armazenar cadernos, páginas, marcadores, recompensas, inventário e configurações do aplicativo.

### **Editor de texto**

\- Tiptap

Está sendo considerado para implementar os recursos de edição de texto rico dentro das caixas de texto posicionáveis.

## **🎨 Prévia da interface**

Os protótipos abaixo servem como referência visual para a interface e a experiência planejadas para o The Bokki. Eles representam a direção atual do design e podem conter elementos provisórios ou ainda não implementados.

A interface final poderá sofrer alterações durante o desenvolvimento.

### **Tela inicial**
<img width="809" height="459" alt="image" src="https://github.com/user-attachments/assets/0a549040-f7d8-4cd3-b041-7bff8666039d" />


### **Caderno**
<img width="809" height="459" alt="image" src="https://github.com/user-attachments/assets/802840bd-6fab-4439-9a45-aedfb44edb65" />
### **Tela criar caderno **
<img width="878" height="489" alt="image" src="https://github.com/user-attachments/assets/7955941b-2c65-4d51-bd7c-84ec376aed96" />
