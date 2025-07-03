// --------------------------------------------------------
// SalasDemo.js — Define as salas do jogo e suas conexões
// -------------------------------------------------------
import { validate } from "bycontract";
import { Sala, Engine, Ferramenta, Objeto } from "./Basicas.js";
import { Martelo, Chave, Lanterna, HasteFerro, Bateria } from "./FerramentasDemo.js";
import { Armario, Bilhete, Gaveta, PoteDeAcucar, PoteDeArroz, Alcapao, Interruptor } from "./ObjetosDemo.js";

function usarObjetoSala(objetos, mochila, ferramenta, objeto) {
  if (!objetos.has(objeto)) return false;
  let obj = objetos.get(objeto);
  obj.engine = global.engine;

  if (!ferramenta || ferramenta === "qualquer") {
    return obj.usar(null);
  }

  if (!mochila.tem(ferramenta)) return false;
  return obj.usar(mochila.pega(ferramenta));
}

export class HallEntrada extends Sala {
  constructor(engine) {
    super("Hall_de_Entrada", engine);
    let gaveta = new Gaveta();
    gaveta.engine = engine;
    this.objetos.set(gaveta.nome, gaveta);
  }

  usa(ferramenta, objeto) {
    return usarObjetoSala(this.objetos, this.engine.mochila, ferramenta, objeto);
  }

  textoDescricao() {
    return (
      "Você está no Hall de Entrada da mansão. O ambiente tem cheiro de madeira antiga e o relógio na parede parece ter parado. Algo nessa casa parece observar você...\n" + super.textoDescricao()
    );
  }
}

export class SalaDeEstar extends Sala {
  constructor(engine) {
    super("Sala_de_Estar", engine);
    let bilhete = new Bilhete();
    bilhete.engine = engine;
    this.objetos.set(bilhete.nome, bilhete);
  }

  usa(ferramenta, objeto) {
    if (objeto === "bilhete") {
      const bilhete = this.objetos.get("bilhete");
      const lanterna = this.engine.mochila.pega("lanterna");

      if (!lanterna || !lanterna.ligada) {
        console.log("Está escuro demais para ler o bilhete. Você precisa de uma fonte de luz.");
        return false;
      }

      return bilhete.usar(lanterna);
    }

    return usarObjetoSala(this.objetos, this.engine.mochila, ferramenta, objeto);
  }
}

export class Quarto extends Sala {
  constructor(engine) {
    super("Quarto", engine);
    let haste = new HasteFerro();
    this.ferramentas.set(haste.nome, haste);
  }

  usa(ferramenta, objeto) {
    return false;
  }

  textoDescricao() {
    return "Você entra no Quarto. Um lugar bagunçado, cheio de móveis cobertos por lençóis. Uma haste de ferro enferrujada está jogada no canto.\n" + super.textoDescricao();
  }
}

export class Banheiro extends Sala {
  constructor(engine) {
    super("Banheiro", engine);
  }

  usa(ferramenta, objeto) {
    return false;
  }

  textoDescricao() {
    return "Você observa o Banheiro. Tudo parece velho, mofado e abandonado. Nada parece útil aqui.\n" + super.textoDescricao();
  }
}

export class Cozinha extends Sala {
  constructor(engine) {
    super("Cozinha", engine);
    let arroz = new PoteDeArroz();
    let acucar = new PoteDeAcucar();
    arroz.engine = engine;
    acucar.engine = engine;
    this.objetos.set(arroz.nome, arroz);
    this.objetos.set(acucar.nome, acucar);
  }

  usa(ferramenta, objeto) {
    const resultado = usarObjetoSala(this.objetos, this.engine.mochila, ferramenta, objeto);

    // Verifica se o jogo foi encerrado por vitória ou derrota
    if (this.engine.estado === "encerrado") {
      setTimeout(() => process.exit(0), 1500); // Encerra o node após um pequeno delay
    }

    return resultado;
  }

  textoDescricao() {
    return "Você entra na Cozinha. O cheiro de algo adocicado ainda paira no ar. Em cima da mesa, dois potes chamam sua atenção...\n" + super.textoDescricao();
  }
}

export class Biblioteca extends Sala {
  constructor(engine) {
    super("Biblioteca", engine);
    let armario = new Armario();
    let interruptor = new Interruptor();
    let alcapao = new Alcapao();
    armario.engine = engine;
    interruptor.engine = engine;
    alcapao.engine = engine;
    this.objetos.set(armario.nome, armario);
    this.objetos.set(interruptor.nome, interruptor);
    this.objetos.set(alcapao.nome, alcapao);
    this.portas.set("Sotao", null);
  }

  usa(ferramenta, objeto) {
    const sucesso = usarObjetoSala(this.objetos, this.engine.mochila, ferramenta, objeto);
    const alcapao = this.objetos.get("alcapao");
    if (alcapao?.acaoOk && !this.portas.get("Sotao")) {
      const sotao = this.engine.salas?.find?.((s) => s.nome === "Sotao");
      if (sotao) {
        this.portas.set("Sotao", sotao);
      }
    }
    return sucesso;
  }

  textoDescricao() {
    const lanterna = this.engine.mochila.pega("lanterna");
    const interruptor = this.objetos.get("interruptor");
    if (lanterna && lanterna.ligada && interruptor && !interruptor.acaoOk) {
      interruptor.acaoOk = true;
    }
    return "Você adentra a Biblioteca. Prateleiras antigas cobrem as paredes, mas a escuridão domina. Talvez uma fonte de luz ajude...\n" + super.textoDescricao();
  }
}

export class Sotao extends Sala {
  constructor(engine) {
    super("Sotao", engine);
    let martelo = new Martelo();
    let bateria = new Bateria();
    this.ferramentas.set(martelo.nome, martelo);
    this.ferramentas.set(bateria.nome, bateria);
  }

  usa(ferramenta, objeto) {
    return false;
  }

  textoDescricao() {
    return "Você sobe para o Sótão. Rangidos ecoam do chão de madeira. Entre caixas cobertas de poeira, algo brilha discretamente...\n" + super.textoDescricao();
  }
}
