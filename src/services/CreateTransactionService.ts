import { getRepository, getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(
    { title, value, type, category }: Request,
    ignoreErrors = false,
  ): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        if (!ignoreErrors) {
          throw new AppError('You does not hava enough balance to this action');
        }
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    const findCategoryByTitle = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (findCategoryByTitle) {
      transaction.category_id = findCategoryByTitle.id;
    } else {
      const newCategory = await categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      transaction.category_id = newCategory.id;
    }

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
