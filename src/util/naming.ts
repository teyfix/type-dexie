import { MustBeCamelCasedError } from '../error/must-be-camel-cased.error';

interface PluralizeRule {
  pattern: RegExp;
  replace: string;
}

class Naming {
  private static readonly LAST_WORD = /([a-z]+|[A-Z][a-z]*)$/;
  private static readonly PLURALIZE_RULES: PluralizeRule[] = [
    { pattern: /(?<=s)$/i, replace: 'ses' },
    { pattern: /y$/i, replace: 'ies' },
    { pattern: /$/i, replace: 's' },
  ];

  camelCase(target: Cls): string {
    if (/^[A-Z]+$/.test(target.name)) {
      return target.name.toLowerCase();
    } else {
      return target.name.replace(/^[A-Z]/g, (m) => m.toLowerCase());
    }
  }

  pluralize(input: string): string {
    for (const rule of Naming.PLURALIZE_RULES) {
      if (rule.pattern.test(input)) {
        return input.replace(rule.pattern, rule.replace);
      }
    }

    return input;
  }

  table(target: Cls): string {
    const camelCased = this.camelCase(target);
    const lastWord = camelCased.match(Naming.LAST_WORD);

    if (null == lastWord) {
      throw new MustBeCamelCasedError();
    }

    return camelCased.replace(Naming.LAST_WORD, this.pluralize(lastWord[0]));
  }

  prop(target: Cls, propertyKey: Key): string {
    return (
      target.name +
      ('symbol' === typeof propertyKey
        ? '[' + propertyKey.toString() + ']'
        : '.' + propertyKey)
    );
  }
}

const naming = new Naming();

export default naming;
