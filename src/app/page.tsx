'use client'

import { Card, InputFile, Spinner } from "@/modules/sharedModule/components"
import { WorksheetService } from "@/modules/sharedModule/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface WorksheetStocksAndFiisItem {
  'Entrada/Saída': 'Credito' | 'Debito';
  'Data': string;
  'Movimentação': 'Transferência - Liquidação' | 'Rendimento' | 'Compra' | 'Dividendo' | 'Atualização' | 'Juros Sobre Capital Próprio' | 'COMPRA / VENDA';
  'Produto': string;
  'Instituição': string;
  'Quantidade': string;
  'Preço unitário': string;
  'Valor da Operação': string
}

export interface WorksheetIncome {
  'Produto': string;
  'Tipo de Evento': 'Dividendo' | 'Juros Sobre Capital Próprio' | 'Rendimento';
  'Valor líquido': string;
}

// export interface WorksheetIncome {
//   'Produto': string;
//   'Tipo de Evento': 'Dividendo' | 'Juros Sobre Capital Próprio' | 'Rendimento';
//   'Valor líquido': string;
//   'CNPJ da Empresa': string;
//   'Quantidade': string;
// }

export default function Page() {
  const [fileStocksAndFiis, setFileStocksAndFiis] = useState<FileList | null>(null)
  const [fileIncome, setFileIncome] = useState<FileList | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (fileStocksAndFiis?.length && fileIncome?.length) {
      handleOnChangeFile();
    }

    async function handleOnChangeFile() {
      if (!fileStocksAndFiis || fileStocksAndFiis.length === 0 || !fileIncome || fileIncome.length === 0) {
        return
      }

      setIsLoading(true);

      const indexReceivedProventsSheet = 5
      // const indexStocksSheet = 0
      const worksheetJsonStocks = await WorksheetService.worksheetsToJson<WorksheetStocksAndFiisItem[]>(fileStocksAndFiis.item(0)!)
      const worksheetJsonIncomes = await WorksheetService.worksheetsToJson<WorksheetIncome[]>(fileIncome.item(0)!, indexReceivedProventsSheet)
      // const worksheetJsonStocksAnnual = await WorksheetService.worksheetsToJson<WorksheetIncome[]>(fileIncome.item(0)!, indexStocksSheet)
      window.sessionStorage.setItem('worksheets', JSON.stringify({ worksheetJsonStocks, worksheetJsonIncomes }))
      router.push('/dados')
    }
  }, [fileStocksAndFiis, fileIncome, router])


  function onChangeFileStockAndFiis(filelist: FileList | null) {
    setFileStocksAndFiis(filelist)
  }

  function onChangeFileIncome(filelist: FileList | null) {
    setFileIncome(filelist)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <Spinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen p-24">
      <Card className="flex-col gap-3 mb-8 text-gray-800">
        <h1 className="text-lg font-medium">Instruções</h1>
        <ol>
          <li className="mb-1">1º Acesse a <a href="https://www.investidor.b3.com.br/" target="_blank" className="inline-flex text-blue-600 hover:text-blue-900 hover:underline">Área do investidor na B3</a></li>
          <li className="mb-1">2º No menu esquerdo selecione a opção &quot;Extratos&quot; e vá na aba &quot;movimentação&quot;;</li>
          <li className="mb-1">3º Clique em &quot;Filtrar&quot; e selecione o intervalo do ano desejado;</li>
          <li className="mb-1">4º Exporte como &quot;XLSX&quot;;</li>
          <li className="mb-1">5º No menu esquerdo selecione a opção &quot;Relatórios&quot;, escolha a aba &quot;Relatório consolidado&quot; e filtre de forma anual o ano desejado;</li>
          <li>6º Baixe o relatório como &quot;Excel&quot;;</li>
        </ol>
      </Card>

      <div className="flex place-items-center gap-10 flex-col">
        <section>
          <div className="text-lg mb-4">Planilha de movimentações</div>
          <Card className="!p-1 max-w-max">
            <InputFile onChange={onChangeFileStockAndFiis} value={fileStocksAndFiis} labelId="fileStock" />
          </Card>
        </section>

        <section>
          <div className="text-lg mb-4">Planilha de relatório anual</div>
          <Card className="!p-1 max-w-max">
            <InputFile onChange={onChangeFileIncome} value={fileIncome} labelId="fileIncome" />
          </Card>
        </section>
      </div>
    </main>
  )
}