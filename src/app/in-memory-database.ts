import {InMemoryDbService} from "angular-in-memory-web-api";
import {Category} from "./pages/categories/shared/category.model";
import {Entry} from "./pages/entries/shared/entry.model";

export class InMemoryDatabase implements InMemoryDbService {

  createDb() {

    const categories: Category[] = [
      {
        id: 1,
        name: "Moradia",
        description: "Pagamentos de contas da casa"
      },
      {
        id: 2,
        name: "Saúde",
        description: "Planos de saúde e remédios"
      },
      {
        id: 3,
        name: "Lazer",
        description: "Cinemas, parques, praia, etc"
      },
      {
        id: 4,
        name: "Salário",
        description: "Recebimento de Salário"
      },
      {
        id: 5,
        name: "Freelas",
        description: "Trabalhos com freelancer"
      },
    ];

    const entries: Entry[] = [
      {
        id: 1,
        name: "Gás de Cozinha",
        description: "descricao",
        type: "expense",
        amount: "15,00",
        date: "14/01/2018",
        paid: true,
        category: categories[0],
        categoryId:  categories[0].id,
      } as Entry,
      {
        id: 1,
        name: "Suplemento",
        description: "descricao",
        type: "revenue",
        amount: "50,00",
        date: "14/10/2018",
        paid: true,
        category: categories[1],
        categoryId: categories[1].id,
      } as Entry,
      {
        id: 1,
        name: "Salário na Empresa X",
        description: "descricao",
        type: "revenue",
        amount: "100,00",
        date: "10/10/2018",
        paid: false,
        category: categories[2],
        categoryId: categories[2].id,
      } as Entry,
      {
        id: 1,
        name: "Moradia",
        description: "descricao",
        type: "expense",
        amount: "2000,00",
        date: "15/02/2018",
        paid: true,
        category: categories[3],
        categoryId: categories[3].id,
      } as Entry,
      {
        id: 1,
        name: "Jiu Jitsu",
        description: "descricao",
        type: "expense",
        amount: "142,00",
        date: "20/01/2018",
        paid: false,
        category: categories[4],
        categoryId: categories[4].id,
      } as Entry,

    ];

    return {categories , entries}



  };
}
