import { classNames } from '../../ConditionalClasses';

describe('util/conditionalClasses', () => {
  it('should return the given "true" classes as a string, test: 1', () => {
    const values = { class1: true, class2: true, class3: false, class4: true };
    const classes = classNames(values);
    expect(classes).toBe('class1 class2 class4');
  });
  it('should return the given "true" classes as a string, test: 2', () => {
    const values = { pesto: false, cosa: false, yellow: false, disabled: true };
    const classes = classNames(values);
    expect(classes).toBe('disabled');
  });
  it('should return the given "true" classes as a string, test: 3', () => {
    const values = { warning: true, another: true, thing: false, disabled: false };
    const classes = classNames(values);
    expect(classes).toBe('warning another');
  });
});
