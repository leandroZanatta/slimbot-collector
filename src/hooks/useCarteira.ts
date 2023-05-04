import { IFaucetCarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CadastroService from "../service/CadastroService";
import { fecharModal, selecionarCarteira } from "../store/slices/CarteiraSlice";
import { buscarCarteirasThunk } from "../store/thunk/CarteiraThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import useUsuarios from "./useUsuarios";
import { useDb } from "./useDb";
import { getSiteKey, getCrsfToken, isLogged, isEmailValid } from '../utilitarios/SiteScraping'
import CaptchaService from "../service/CaptchaService";
import useLoadingMessage from "./useLoadingMessage";
import CarteiraRepository from "../repository/CarteiraRepository";
import ConfiguracaoRepository from "../repository/ConfiguracaoRepository";
import Configuracao from "../repository/model/configuracao/Configuracao";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import FaucetRepository from "../repository/FaucetRepository";


export default function useCarteira() {

    const { db } = useDb();
    const { usuarioSelecionado } = useUsuarios();
    const { addLoading, fecharLoading } = useLoadingMessage();
    const carteiras = useAppSelector((state: any) => state.CarteiraSlice.carteiras);
    const carteira = useAppSelector((state: any) => state.CarteiraSlice.carteira);
    const modalCarteiraAberta = useAppSelector((state: any) => state.CarteiraSlice.modalCarteiraAberta);

    const dispatch = useAppDispatch();

    const fecharModalCarteira = () => {
        dispatch(fecharModal());
    }

    const editarCarteira = (carteira: IFaucetCarteiraProps) => {
        dispatch(selecionarCarteira(carteira));
    }

    const atualizarInfomacaoSite = async (carteira: IFaucetCarteiraProps) => {
        
        try {

            addLoading(`${carteira.descricao} - Buscando dados do site...`);

            const configuracaoRepository = new ConfiguracaoRepository(db);
            const cadastroService = new CadastroService(carteira, usuarioSelecionado);
            const captchaService = new CaptchaService();

            const config: IConfiguracaoProps | null = await configuracaoRepository.findFirst(Configuracao.Builder());

            if (config) {

                if (!carteira.ativo && carteira.situacao == 0) {

                    const retornoPaginaCadastro = await cadastroService.obterPaginaCadastro();

                    const sitekey: string = getSiteKey(retornoPaginaCadastro.data);
                    var crsfToken: string = getCrsfToken(retornoPaginaCadastro.data);

                    addLoading(`${carteira.descricao} - Resolvendo Captcha...`);

                    const tokenCaptcha = await captchaService.obterCaptcha({
                        host: carteira.host,
                        siteKey: sitekey,
                        captchaUrl: config.captchaHost
                    })

                    addLoading(`${carteira.descricao} - Efetuando cadastro...`);

                    const retornoCadastro = await cadastroService.efetuarCadastro(crsfToken, tokenCaptcha);

                    if (retornoCadastro.status === 200) {

                        if (retornoCadastro.headers['content-type'].indexOf('text/html') >= 0 || retornoCadastro.data.success) {

                            await validarAutenticacaoSite(cadastroService, carteira, config);

                            return;
                        }
                    } else {

                        if (retornoCadastro.data.error[0] === 'You cannot create more than one account') {
                            // Problemas de IP já registrou conta
                        }
                    }

                }

                await validarAutenticacaoSite(cadastroService, carteira, config);
            }
        } finally {

            fecharLoading();
        }
    }

    const validarAutenticacaoSite = async (cadastroService: CadastroService, carteira: IFaucetCarteiraProps, config: IConfiguracaoProps) => {
       
        addLoading(`${carteira.descricao} - Buscando dados de autenticação...`);

        var retornoPaginaInicial = await cadastroService.obterPaginaInicial();

        var crsfToken: string = getCrsfToken(retornoPaginaInicial.data);
        const sitekey: string = getSiteKey(retornoPaginaInicial.data);

        while (!isLogged(retornoPaginaInicial.data)) {

            addLoading(`${carteira.descricao} - Resolvendo Captcha...`);

            crsfToken = getCrsfToken(retornoPaginaInicial.data);

            const tokenLogin = await new CaptchaService().obterCaptcha({
                host: carteira.host,
                siteKey: sitekey,
                captchaUrl: config.captchaHost
            })

            addLoading(`${carteira.descricao} - Efetuando login...`);

            const retornoLogin = await cadastroService.efetuarLogin(crsfToken, tokenLogin);

            retornoPaginaInicial = await cadastroService.obterPaginaInicial();
        }

        const emailValido: boolean = isEmailValid(retornoPaginaInicial.data);

        addLoading(`${carteira.descricao} - Salvando dados...`);

        new FaucetRepository(db).atualizarSituacaoFaucet(carteira.codigoFaucet, emailValido, emailValido ? 3 : 2);

        buscarCarteiras();
    }

    const buscarCarteiras = () => {
        dispatch(buscarCarteirasThunk({ db, codigoUsuario: usuarioSelecionado.id }));
    }

    return {
        carteiras,
        carteira,
        modalCarteiraAberta,
        fecharModalCarteira,
        editarCarteira,
        buscarCarteiras,
        atualizarInfomacaoSite
    }
}