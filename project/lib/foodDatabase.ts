export type FoodItem = {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
};

// Base de données étendue d'aliments communs
export const commonFoods: FoodItem[] = [
  {
    name: 'Pomme',
    calories: 52,
    proteins: 0.3,
    carbs: 14,
    fats: 0.2,
  },
  {
    name: 'Banane',
    calories: 89,
    proteins: 1.1,
    carbs: 23,
    fats: 0.3,
  },
  {
    name: 'Poulet (blanc)',
    calories: 165,
    proteins: 31,
    carbs: 0,
    fats: 3.6,
  },
  {
    name: 'Riz blanc cuit',
    calories: 130,
    proteins: 2.7,
    carbs: 28,
    fats: 0.3,
  },
  {
    name: 'Oeuf',
    calories: 155,
    proteins: 13,
    carbs: 1.1,
    fats: 11,
  },
  {
    name: 'Pain complet',
    calories: 247,
    proteins: 9.4,
    carbs: 41,
    fats: 3.3,
  },
  {
    name: 'Yaourt nature',
    calories: 59,
    proteins: 3.5,
    carbs: 4.7,
    fats: 3.3,
  },
  {
    name: 'Saumon',
    calories: 208,
    proteins: 22,
    carbs: 0,
    fats: 13,
  },
  {
    name: 'Avocat',
    calories: 160,
    proteins: 2,
    carbs: 8.5,
    fats: 14.7,
  },
  {
    name: 'Lentilles cuites',
    calories: 116,
    proteins: 9,
    carbs: 20,
    fats: 0.4,
  },
  {
    name: 'Pâtes cuites',
    calories: 158,
    proteins: 5.8,
    carbs: 31,
    fats: 0.9,
  },
  {
    name: 'Thon en conserve',
    calories: 132,
    proteins: 26,
    carbs: 0,
    fats: 2.6,
  },
  {
    name: 'Fromage blanc 0%',
    calories: 43,
    proteins: 8,
    carbs: 3.5,
    fats: 0.2,
  },
  {
    name: 'Amandes',
    calories: 576,
    proteins: 21,
    carbs: 22,
    fats: 49,
  },
  {
    name: 'Quinoa cuit',
    calories: 120,
    proteins: 4.4,
    carbs: 21.3,
    fats: 1.9,
  },
  {
    name: 'Brocoli cuit',
    calories: 35,
    proteins: 2.4,
    carbs: 7.2,
    fats: 0.4,
  },
  {
    name: 'Patate douce cuite',
    calories: 90,
    proteins: 2,
    carbs: 21,
    fats: 0.2,
  },
  {
    name: 'Tomate',
    calories: 18,
    proteins: 0.9,
    carbs: 3.9,
    fats: 0.2,
  },
  {
    name: 'Fromage mozzarella',
    calories: 280,
    proteins: 28,
    carbs: 2.2,
    fats: 17,
  },
  {
    name: 'Huile d\'olive',
    calories: 884,
    proteins: 0,
    carbs: 0,
    fats: 100,
  }
];

export const searchLocalFoods = (query: string): FoodItem[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return commonFoods.filter((food) =>
    food.name.toLowerCase().includes(normalizedQuery)
  );
};