/** Categories.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Page that allows the creation and edit of categories
 */
// Libraries
import { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Services
import CategoryService from '../../Services/CategoryService';

// Components
import CategoryCard from './CategoryCard';
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import CategoryForm from './CategoryForm';

// Styles
import './Categories.css';

const Categories = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, categories, dispatchCategories } = useContext(MainStore);

  // Starts the services
  const categoryService = new CategoryService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [type, setType] = useState(0);
  const [showAddModal, setAddModal] = useState(false);

  // Main API call
  useEffect(() => {
    categoryService
      .getCategories()
      .then((catRes) => {
        dispatchCategories({
          type: 'UPDATE',
          payload: catRes.data,
        });
      })
      .finally(() => setLoaded(true));
  }, []);

  const header = (
    <div className="">
      <div>
        <h1>Categories</h1>
      </div>
    </div>
  );

  return (
    <Page loading={!loaded} selected="Categories" header={header}>
      <>
        {/*Add category button*/}
        <Button accent round className="Categories__AddFloat" onClick={() => setAddModal(true)}>
          <FaIcons.FaPlus />
        </Button>

        {/* Add/edit category Form */}
        <CategoryForm state={showAddModal} set={setAddModal} />

        <div className="Categories">
          <div className="Categories__Container">
            {/* Selector for the items */}
            <div className="Categories__Container__Selector">
              <div className={type === 0 ? 'selected' : ''} onClick={() => setType(0)}>
                Income
              </div>
              <div className={type === 1 ? 'selected' : ''} onClick={() => setType(1)}>
                Expense
              </div>
              <div className={type === 2 ? 'selected' : ''} onClick={() => setType(2)}>
                Archived
              </div>
            </div>
            <div className="Categories__Container__List">
              {/* Income categories */}
              {type === 0 &&
                categories.Income.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} disabled={cat.user_id !== authToken._id} />
                ))}
              {/* Expense categories */}
              {type === 1 &&
                categories.Expense.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} disabled={cat.user_id !== authToken._id} />
                ))}
              {type === 2 &&
                categories.Archived.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} disabled={cat.user_id !== authToken._id} />
                ))}
            </div>
          </div>
        </div>
      </>
    </Page>
  );
};

export default Categories;
