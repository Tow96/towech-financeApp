import { prisma } from './prisma';

export const getCategories = async () => {
  const categories = await prisma.categories.findMany({ where: { user_id: '-1' } });

  const incomeCats: any[] = [];
  const expenseCats: any[] = [];
  const archivedCats: any[] = [];

  categories.forEach(category => {
    if (category.archived) {
      archivedCats.push(category);
    } else {
      switch (category.type) {
        case 'Income':
          incomeCats.push(category);
          break;
        case 'Expense':
          expenseCats.push(category);
          break;
      }
    }
  });

  return { Income: incomeCats, Expense: expenseCats, Archived: archivedCats };
};
