import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balanceArray: Balance[] = transactions.map(item => {
      if (item.type === 'income') {
        return {
          income: item.value,
          outcome: 0,
          total: 0,
        };
      }

      if (item.type === 'outcome') {
        return {
          income: 0,
          outcome: item.value,
          total: 0,
        };
      }

      return {
        income: 0,
        outcome: 0,
        total: 0,
      };
    });

    const balance = balanceArray.reduce(
      (prev, curr) => {
        const income = prev.income + curr.income;
        const outcome = prev.outcome + curr.outcome;
        return {
          income,
          outcome,
          total: income - outcome,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
