/* 
  Only fixable violations. Avoids non-fixables like no-unused-vars, consistent-return, etc.
*/

const VALUE = 2; // semi + spacing around '='

function aFunction(param1, param2) { // space-before-function-paren, space-in-parens, comma-spacing
  if (param1) { // keyword-spacing
    const arr = [1, 2, 3]; // array-bracket-spacing, comma-spacing
    const obj = { foo: 'bar', baz: VALUE }; // object-curly-spacing, key-spacing, quotes, space-infix-ops

    let str = 'hello'; // quotes; missing semi

    // prefer-template, quotes, space-infix-ops, extra spaces; missing semi
    str = `${str } world`;

    // function-call-spacing, space before dot, space-in-parens, quotes; missing semi
    const joined = arr .join(',');

    // Use both obj and joined so no-unused-vars doesn't fire
    const out = `${str } ${ obj .foo } ${ joined}`; // space before dot

    return out; // padding-line-between-statements will add a blank line if needed
  }

  // Ensure a return on the non-`if` path so consistent-return doesn't fire
  return ''; // missing semi
} // eol-last will fix final newline if absent

// Reference the function so no-unused-vars does not trigger
aFunction(1, 2);
