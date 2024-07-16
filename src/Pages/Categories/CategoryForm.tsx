/** CategoryForm.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * The component shown when adding or editing a Category, it is a modal
 */
import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
// import { MainStore } from '../../Hooks/ContextStore';
// import { IdIcons } from '../../Icons';
// import Button from '../../Components/Button';
// import Errorbox from '../../Components/ErrorBox';
import IconSelector from '../../Components/IconSelector';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Objects } from '../../models';

// Services
// import CategoryService from '../../Services/CategoryService';

// Utilities
// import CheckNested from '../../Utils/CheckNested';

// Styles
import './Categories.css';
import CategorySelector from '../../Components/CategorySelector';

interface Props {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialCategory?: Objects.Category;
}

const CategoryForm = (props: Props): JSX.Element => {
  // Context
  // const { authToken, dispatchAuthToken, dispatchCategories } = useContext(MainStore);

  // Hooks
  // const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [deleteWarn, setDeleteWarn] = useState(false);

  // This Hook contains all the information of the categoryForm
  const categoryForm = UseForm(null, {
    name: props.initialCategory?.name || '',
    icon_id: props.initialCategory?.icon_id || 0,
    type: props.initialCategory?.type || '',
    parent_id: props.initialCategory?.parent_id || '-1',
    global: props.initialCategory?.parent_id === '-1' || false,
  });

  // Functions
  async function parentOnChange(e: any) {
    switch (e.value) {
      case '-4':
        categoryForm.values.parent_id = '-1';
        categoryForm.values.type = 'Expense';
        break;
      case '-3':
        categoryForm.values.parent_id = '-1';
        categoryForm.values.type = 'Income';
        break;
      default:
        categoryForm.values.parent_id = e.value;
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  return (
    <>
      <Modal
        showModal={props.state}
        setModal={props.set}
        // loading={loading}
        title={props.initialCategory ? 'Edit Category' : 'New Category'}
        accept={acceptIcon}
        onClose={() => {
          categoryForm.clear();
          setErrors([]);
        }}
      >
        <div className="CategoryForm">
          <div className="CategoryForm__FirstRow">
            <IconSelector
              className="CategoryForm__FirstRow__Icon"
              name="icon_id"
              value={categoryForm.values.icon_id}
              onChange={categoryForm.onChange}
            />
            <div className="CategoryForm__FirstRow__Name">
              <Input
                error={errors.name ? true : false}
                name="name"
                type="text"
                label="Name"
                value={categoryForm.values.name}
                onChange={categoryForm.onChange}
              />
            </div>
          </div>
          <div className="CategoryForm__Secondrow">
            {/* Category selector */}
            <CategorySelector
              parentSelector
              error={errors.parent_id}
              name="category_id"
              onChange={parentOnChange}
              // value={transactionForm.values.category_id}
              visible={props.state}
            ></CategorySelector>
          </div>
        </div>
      </Modal>

      {props.initialCategory && (
        <Modal float setModal={setDeleteWarn} showModal={deleteWarn} accept="Delete">
          <>
            <p>Are you sure you want to delete the category: {props.initialCategory.name}?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

export default CategoryForm;
