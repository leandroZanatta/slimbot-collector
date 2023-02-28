
export default class CotacaoAtivoService {

    public async buscarCotacaoAtivos(ativos: string): Promise<any> {

        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ativos}&vs_currencies=brl&precision=8`);

        return await response.json();
    }

}


