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
    const transactions = await this.createQueryBuilder()
      .select('type')
      .addSelect('SUM(value)', 'value')
      .groupBy('type')
      .getRawMany();

    const income = transactions.find(item => {
      return item.type === 'income';
    });

    const outcome = transactions.find(item => {
      return item.type === 'outcome';
    });
    const incomeValue = income ? income.value : 0;
    const outcomeValue = outcome ? outcome.value : 0;
    const total = incomeValue - outcomeValue;

    return { income: incomeValue, outcome: outcomeValue, total };
  }
}

export default TransactionsRepository;
