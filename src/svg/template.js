function template(
  { template },
  opts,
  { imports, componentName, props, jsx, exports }
) {
  return template.ast`
    import * as React from 'react';

    const ${componentName} = (${props}) => ${jsx}
    ${exports}
  `;
}
module.exports = template;
