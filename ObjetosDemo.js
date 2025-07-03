// --------------------------------------------------------
// ObjetosDemo.js
// Define os objetos interativos do jogo e suas regras de uso
// --------------------------------------------------------

import { Objeto } from "./Basicas.js";
import { Chave, Lanterna } from "./FerramentasDemo.js";

export class Gaveta extends Objeto {
  constructor() {
    super("gaveta", "Uma velha cômoda de madeira. A gaveta parece emperrada.", "A gaveta foi aberta. Dentro havia uma chave!");
  }

  usar(ferramenta) {
    if (!this.acaoOk) {
      this.acaoOk = true;
      this.engine.salaCorrente.ferramentas.set("chave", new Chave());
      return true;
    }
    return false;
  }
}

export class Bilhete extends Objeto {
  constructor() {
    super("bilhete", "Você não consegue ler o que está escrito, está escuro demais...", 'O bilhete revela uma mensagem rabiscada: "a vida é doce".');
  }

  usar(ferramenta) {
    if (ferramenta && ferramenta.nome === "lanterna" && ferramenta.ligada) {
      this.acaoOk = true;
      console.log("A luz revela o conteúdo do bilhete.");
      return true;
    }
    return false;
  }
}

export class Armario extends Objeto {
  constructor() {
    super("armario", "Um armário trancado. Algo pode estar dentro...", "O armário está aberto. Há uma lanterna dentro.");
  }

  usar(ferramenta) {
    if (!this.acaoOk && ferramenta && ferramenta.nome === "chave") {
      this.acaoOk = true;
      this.engine.salaCorrente.ferramentas.set("lanterna", new Lanterna());
      return true;
    }
    return false;
  }
}

export class Interruptor extends Objeto {
  constructor() {
    super("interruptor", "Está muito escuro para ver algo aqui.", "Você encontrou o interruptor e acendeu as luzes da biblioteca.");
  }

  usar(ferramenta) {
    return false;
  }
}

export class Alcapao extends Objeto {
  constructor() {
    super("alcapao", "Há algo no teto. Parece um alçapão, mas está fechado.", "Você puxou o alçapão com a haste e revelou uma passagem secreta!");
  }

  usar(ferramenta) {
    if (!this.acaoOk && ferramenta && ferramenta.nome === "haste") {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
}

export class PoteDeAcucar extends Objeto {
  constructor() {
    super("pote_de_acucar", "O pote de açúcar está fechado.", "O pote quebrou! Havia um diamante dentro!");
  }

  usar(ferramenta) {
    if (ferramenta && ferramenta.nome === "martelo") {
      if (!this.acaoOk) {
        this.acaoOk = true;
        console.log("Você quebra o pote de açúcar e entre os cacos brilha algo... É o diamante!");
        this.engine.indicaFimDeJogo("vitoria");
      }
      return true;
    }
    return false;
  }
}

export class PoteDeArroz extends Objeto {
  constructor() {
    super("pote_de_arroz", "O pote de arroz está fechado.", "Você quebrou o pote errado! O barulho aciona o alarme e luzes vermelhas piscam...");
  }

  usar(ferramenta) {
    if (ferramenta && ferramenta.nome === "martelo") {
      if (!this.acaoOk) {
        this.acaoOk = true;
        console.log("Você quebra o pote de arroz. Mas não há nada dentro. O alarme dispara e você foi pego em flagrante pela polícia!");
        this.engine.indicaFimDeJogo("derrota");
      }
      return true;
    }
    return false;
  }
}
