/** CategorySelecor
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Selector for categories
 */
// Libraries
import React, { useContext, useEffect, useState } from 'react';

// Components
import Modal from '../Modal';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Models
import { Objects } from '../../models';

// Utilities
import { IdIcons } from '../../Icons';

// Styles
import './CategorySelector.css';

interface CategorySelectorProps {
  error?: boolean;
  value?: string;
  onChange?: any;
  name?: string;
  visible: boolean;
  edit?: boolean;
  parentSelector?: boolean;
  transfer?: boolean;
}

const CategorySelector = (props: CategorySelectorProps): JSX.Element => {
  const { categories } = useContext(MainStore);
  const [categoryType, setCategoryType] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null as Objects.Category | null);

  // Start useEffect, only updates the when the form is visible
  useEffect(() => {
    if (props.visible && props.value !== (selectedCategory?._id || '-1')) {
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible]);

  // Functions
  const searchAndSetView = (id: string): void => {
    const allCats = [...categories.Expense, ...categories.Income];
    let selected: Objects.Category | undefined;

    switch (id) {
      case '-4':
        selected = {
          _id: '-4',
          name: 'None (Expense)',
          type: 'Expense',
          user_id: '-1',
          parent_id: '-1',
          icon_id: 0,
        };
        break;
      case '-3':
        selected = {
          _id: '-3',
          name: 'None (Income)',
          type: 'Income',
          user_id: '-1',
          parent_id: '-1',
          icon_id: 0,
        };
        break;
      case '-2':
        selected = {
          _id: '-2',
          name: 'Transfer',
          type: 'Expense',
          user_id: '-1',
          parent_id: '-1',
          icon_id: -2,
        };
        break;
      default:
        selected = allCats.find((cat) => cat._id === id);
    }

    setSelectedCategory(selected || null);
  };

  const setCategoryCallback = (id: string): void => {
    searchAndSetView(id);
    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: id,
        },
      });
    }
    setShowModal(false);
  };

  return (
    <div className={props.transfer ? 'loading' : ''}>
      <div
        className={props.error ? 'CategorySelector error' : 'CategorySelector'}
        onClick={() => setShowModal(true)}
      >
        <IdIcons.Variable
          iconid={selectedCategory?.icon_id || 0}
          className="CategorySelector__Icon"
        />
        <div className="CategorySelector__Name">{selectedCategory?.name || 'Select Category'}</div>
        <div className="CategorySelector__Open">
          <div className="CategorySelector__Triangle" />
        </div>
      </div>

      <Modal setModal={setShowModal} showModal={showModal}>
        <>
          {/* Header selector */}
          <div className="CategorySelector__Container__Header">
            {!props.edit && !props.parentSelector && (
              <div
                className={categoryType === 0 ? 'selected' : ''}
                onClick={() => setCategoryType(0)}
              >
                Other
              </div>
            )}
            <div
              className={categoryType === 1 ? 'selected' : ''}
              onClick={() => setCategoryType(1)}
            >
              Income
            </div>
            <div
              className={categoryType === 2 ? 'selected' : ''}
              onClick={() => setCategoryType(2)}
            >
              Expense
            </div>
          </div>
          {/* Categories */}
          <div className="CategorySelector__Container__List">
            {/* None selector */}
            {/* {props.parentSelector && (
              <div
                className="CategorySelector__Container__List__Category"
                onClick={() => setCategoryCallback(categoryType === 1 ? '-3' : '-4')}
              >
                <IdIcons.Variable
                  iconid={0}
                  className={getSelectedCategoryClass({
                    parent_id: '-1',
                    _id: categoryType === 1 ? '-3' : '-4',
                    icon_id: 0,
                    name: categoryType === 1 ? 'None (Income)' : 'None (Expense)',
                  } as Objects.Category)}
                />
                <div className="NewTransactionForm__CategorySelector__Category__Name">
                  {categoryType === 1 ? 'None (Income)' : 'None (Expense)'}
                </div>
              </div>
            )} */}
            {/* Other Categories */}
            {categoryType === 0 ? (
              <CategoryCard
                key="-2"
                category={{
                  _id: '-2',
                  icon_id: -2,
                  name: 'transfer',
                  parent_id: '-1',
                  type: 'Expense',
                  user_id: '-1',
                }}
                selectedCategory={selectedCategory}
                setCategory={setCategoryCallback}
              />
            ) : categoryType === 1 ? (
              categories.Income.map((cat: Objects.Category) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  selectedCategory={selectedCategory}
                  setCategory={setCategoryCallback}
                />
              ))
            ) : (
              categories.Expense.map((cat: Objects.Category) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  selectedCategory={selectedCategory}
                  setCategory={setCategoryCallback}
                />
              ))
            )}
          </div>
        </>
      </Modal>
    </div>
  );
};

interface CategoryCardProps {
  category: Objects.Category;
  selectedCategory: Objects.Category | null;
  setCategory: (id: string) => void;
}

const CategoryCard = (props: CategoryCardProps): JSX.Element => {
  const getSelectedCategoryClass = (category: Objects.Category): string => {
    let output = 'CategorySelector__CategoryCard__Icon';

    if (category.parent_id !== '-1') {
      output += ' SubCategory';
    }

    if (category._id === props.selectedCategory?._id) {
      output += ' selected';
    }

    return output;
  };

  return (
    <div
      className="CategorySelector__CategoryCard"
      onClick={() => props.setCategory(props.category._id)}
    >
      <div
        className={
          props.category.parent_id === '-1'
            ? 'CategorySelector__CategoryCard__Main'
            : 'CategorySelector__CategoryCard__Main SubCategory'
        }
      >
        <IdIcons.Variable
          iconid={props.category.icon_id}
          className={getSelectedCategoryClass(props.category)}
        />
        <div>{props.category.name}</div>
      </div>
    </div>
  );
};

export default CategorySelector;
