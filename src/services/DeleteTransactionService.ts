import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const existsTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!existsTransaction) {
      throw new AppError('This transactions not exists');
    } else {
      await transactionRepository.remove(existsTransaction);
    }
  }
}

export default DeleteTransactionService;
