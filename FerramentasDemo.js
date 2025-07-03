// --------------------------------------------------------
// FerramentasDemo.js
// Define ferramentas específicas do jogo com suas ações e estados
// --------------------------------------------------------
import { Ferramenta } from "./Basicas.js";

export class Martelo extends Ferramenta {
  constructor() {
    super("martelo");
    this.usado = false;
  }

  usar() {
    if (this.usado) {
      console.log("O martelo já está quebrado e não pode mais ser usado.");
      return false;
    } else {
      this.usado = true;
      console.log("Você usa o martelo com força... Ele se parte logo após o impacto.");
      return true;
    }
  }

  get descricaoInventario() {
    return this.usado ? "martelo (quebrado)" : "martelo (frágil)";
  }
}

export class Chave extends Ferramenta {
  constructor() {
    super("chave");
  }

  usar() {
    console.log("Você tenta usar a chave... O clique metálico ecoa na mansão.");
    return true;
  }
}

export class Lanterna extends Ferramenta {
  constructor() {
    super("lanterna");
    this.cargas = 1;
    this.ligada = false;
  }

  usar() {
    if (this.cargas > 0) {
      this.cargas--;
      this.ligada = true;
      console.log("Você ligou a lanterna. O feixe de luz corta a escuridão.");
      return true;
    } else {
      console.log("A lanterna está descarregada. Tudo ao redor parece mais sombrio agora.");
      return false;
    }
  }

  carregar() {
    this.cargas = 1;
    this.ligada = false;
    console.log("Você instala a bateria na lanterna. Está pronta para mais uma rodada de luz.");
    return true;
  }

  get descricaoInventario() {
    return `${this.nome} (${this.cargas} uso${this.cargas === 1 ? "" : "s"} restante${this.cargas === 1 ? "" : "s"})`;
  }
}

export class HasteFerro extends Ferramenta {
  constructor() {
    super("haste");
  }

  usar() {
    console.log("Você usa a haste de ferro com precisão. Um estalo indica que algo cedeu.");
    return true;
  }
}

export class Bateria extends Ferramenta {
  constructor() {
    super("bateria");
  }

  usar() {
    console.log("A bateria não pode ser usada diretamente. Talvez sirva para algo na sua mochila.");
    return false;
  }
}
