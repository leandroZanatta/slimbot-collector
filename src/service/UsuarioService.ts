import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import UsuarioRepository from "../repository/UsuarioRepository";
import Usuario from "../repository/model/usuario/Usuario";
import { IUsuarioProps } from "../repository/model/usuario/Usuario.meta";
import CarteiraRepository from "../repository/CarteiraRepository";
import FaucetRepository from "../repository/FaucetRepository";
import Carteira from "../repository/model/carteira/Carteira";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import Faucet from "../repository/model/faucet/Faucet";

export default class UsuarioService {

    private usuarioRepository: UsuarioRepository;
    private db: WebSQLDatabase;

    constructor(db: WebSQLDatabase) {
        this.usuarioRepository = new UsuarioRepository(db);
        this.db = db;
    }

    public async buscar(): Promise<Array<IUsuarioProps>> {

        return await this.usuarioRepository.list(Usuario.Builder());
    }

    public async alterarSituacaoUsuario(codigoUsuario: number): Promise<void> {

        await this.usuarioRepository.alterarSituacaoUsuario(codigoUsuario);
    }

    public async salvar(usuario: Usuario, ativo: boolean): Promise<IUsuarioProps> {

        const carteiraRepository: CarteiraRepository = new CarteiraRepository(this.db);
        const faucetRepository: FaucetRepository = new FaucetRepository(this.db);


        const usuariosRegistrados = await this.buscar();

        if (usuariosRegistrados.length == 0) {

            usuario.principal('S');
        }

        const novoUsuario: IUsuarioProps = await this.usuarioRepository.save(usuario);
        const carteiras: Array<ICarteiraProps> = await carteiraRepository.list(Carteira.Builder());

        carteiras.forEach(carteira => {
            faucetRepository.save(Faucet.Builder().codigoCarteira(carteira.id).codigoUsuario(novoUsuario.id).proximaExecucao(new Date()).saldoAtual(0).ativo(ativo).situacao(ativo ? 3 : 0));
        });

        return novoUsuario;
    }
}