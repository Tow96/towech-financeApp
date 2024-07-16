/** CategoryCard.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Page that allows the creation and edit of categories
 */
// Models
import { IdIcons } from '../../Icons';
import { Objects } from '../../models';

interface Props {
  disabled?: boolean;
  category: Objects.Category;
}

const CategoryCard = (props: Props): JSX.Element => {
  const getTheme = (): string => {
    let theme = props.category.parent_id === '-1' ? 'CategoryCard' : 'SubCategoryCard';

    if (props.disabled) theme += ' loading';

    return theme;
  };

  return (
    <div className={getTheme()}>
      <IdIcons.Variable
        iconid={props.category.icon_id}
        className={props.category.parent_id === '-1' ? 'CategoryCard__Icon' : 'SubCategoryCard__Icon'}
      />
      <div className={props.category.parent_id === '-1' ? 'CategoryCard__Name' : 'SubCategoryCard__Name'}>
        {props.category.name}
      </div>
    </div>
  );
};

export default CategoryCard;
