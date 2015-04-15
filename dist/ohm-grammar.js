var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
  return new this.newGrammar('Ohm')
    .define('Grammars', 0, this.many(this.app('Grammar'), 0))
    .define('Grammar', 0, this.seq(this.app('ident'), this.opt(this.app('SuperGrammar')), this.prim('{'), this.many(this.app('Rule'), 0), this.prim('}')))
    .define('SuperGrammar', 0, this.seq(this.prim('<:'), this.app('ident')))
    .define('Rule_define', 0, this.seq(this.app('ident'), this.app('Formals'), this.opt(this.app('ruleDescr')), this.prim('='), this.app('Alt')))
    .define('Rule_override', 0, this.seq(this.app('ident'), this.app('Formals'), this.prim(':='), this.app('Alt')))
    .define('Rule_extend', 0, this.seq(this.app('ident'), this.app('Formals'), this.prim('+='), this.app('Alt')))
    .define('Rule', 0, this.alt(this.app('Rule_define'), this.app('Rule_override'), this.app('Rule_extend')))
    .define('Formals_some', 0, this.seq(this.prim('<'), this.app('ident'), this.many(this.seq(this.prim(','), this.app('ident')), 0), this.prim('>')))
    .define('Formals_none', 0, this.seq())
    .define('Formals', 0, this.alt(this.app('Formals_some'), this.app('Formals_none')))
    .define('Params_some', 0, this.seq(this.prim('<'), this.app('Seq'), this.many(this.seq(this.prim(','), this.app('Seq')), 0), this.prim('>')))
    .define('Params_none', 0, this.seq())
    .define('Params', 0, this.alt(this.app('Params_some'), this.app('Params_none')))
    .define('Alt', 0, this.seq(this.app('Term'), this.many(this.seq(this.prim('|'), this.app('Term')), 0)))
    .define('Term_inline', 0, this.seq(this.app('Seq'), this.app('caseName')))
    .define('Term', 0, this.alt(this.app('Term_inline'), this.app('Seq')))
    .define('Seq', 0, this.many(this.app('Iter'), 0))
    .define('Iter_star', 0, this.seq(this.app('Pred'), this.prim('*')))
    .define('Iter_plus', 0, this.seq(this.app('Pred'), this.prim('+')))
    .define('Iter_opt', 0, this.seq(this.app('Pred'), this.prim('?')))
    .define('Iter', 0, this.alt(this.app('Iter_star'), this.app('Iter_plus'), this.app('Iter_opt'), this.app('Pred')))
    .define('Pred_not', 0, this.seq(this.prim('~'), this.app('Base')))
    .define('Pred_lookahead', 0, this.seq(this.prim('&'), this.app('Base')))
    .define('Pred', 0, this.alt(this.app('Pred_not'), this.app('Pred_lookahead'), this.app('Base')))
    .define('Base_application', 0, this.seq(this.app('ident'), this.app('Params'), this.not(this.alt(this.seq(this.opt(this.app('ruleDescr')), this.prim('=')), this.prim(':='), this.prim('+=')))))
    .define('Base_prim', 0, this.alt(this.app('keyword'), this.app('string'), this.app('regExp'), this.app('number')))
    .define('Base_paren', 0, this.seq(this.prim('('), this.app('Alt'), this.prim(')')))
    .define('Base_arr', 0, this.seq(this.prim('['), this.app('Alt'), this.prim(']')))
    .define('Base_str', 0, this.seq(this.prim('``'), this.app('Alt'), this.prim("''")))
    .define('Base_obj', 0, this.seq(this.prim('{'), this.opt(this.prim('...')), this.prim('}')))
    .define('Base_objWithProps', 0, this.seq(this.prim('{'), this.app('Props'), this.opt(this.seq(this.prim(','), this.prim('...'))), this.prim('}')))
    .define('Base', 0, this.alt(this.app('Base_application'), this.app('Base_prim'), this.app('Base_paren'), this.app('Base_arr'), this.app('Base_str'), this.app('Base_obj'), this.app('Base_objWithProps')))
    .define('Props', 0, this.seq(this.app('Prop'), this.many(this.seq(this.prim(','), this.app('Prop')), 0)))
    .define('Prop', 0, this.seq(this.alt(this.app('name'), this.app('string')), this.prim(':'), this.app('Alt')))
    .define('ruleDescr', 0, this.seq(this.prim('('), this.app('ruleDescrText'), this.prim(')')), 'a rule description')
    .define('ruleDescrText', 0, this.many(this.seq(this.not(this.prim(')')), this.app('_')), 0))
    .define('caseName', 0, this.seq(this.prim('--'), this.many(this.seq(this.not(this.prim('\n')), this.app('space')), 0), this.app('name'), this.many(this.seq(this.not(this.prim('\n')), this.app('space')), 0), this.alt(this.prim('\n'), this.la(this.prim('}')))))
    .define('name', 0, this.seq(this.app('nameFirst'), this.many(this.app('nameRest'), 0)), 'a name')
    .define('nameFirst', 0, this.alt(this.prim('_'), this.app('letter')))
    .define('nameRest', 0, this.alt(this.prim('_'), this.app('alnum')))
    .define('ident', 0, this.seq(this.not(this.app('keyword')), this.app('name')), 'an identifier')
    .define('keyword_undefined', 0, this.seq(this.prim('undefined'), this.not(this.app('nameRest'))))
    .define('keyword_null', 0, this.seq(this.prim('null'), this.not(this.app('nameRest'))))
    .define('keyword_true', 0, this.seq(this.prim('true'), this.not(this.app('nameRest'))))
    .define('keyword_false', 0, this.seq(this.prim('false'), this.not(this.app('nameRest'))))
    .define('keyword', 0, this.alt(this.app('keyword_undefined'), this.app('keyword_null'), this.app('keyword_true'), this.app('keyword_false')))
    .define('string', 0, this.seq(this.prim('"'), this.many(this.app('strChar'), 0), this.prim('"')), 'a string literal')
    .define('strChar', 0, this.alt(this.app('escapeChar'), this.seq(this.not(this.prim('"')), this.not(this.prim('\n')), this.app('_'))))
    .define('escapeChar_hexEscape', 0, this.seq(this.prim('\\x'), this.app('hexDigit'), this.app('hexDigit')))
    .define('escapeChar_unicodeEscape', 0, this.seq(this.prim('\\u'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit'), this.app('hexDigit')))
    .define('escapeChar_escape', 0, this.seq(this.prim('\\'), this.app('_')))
    .define('escapeChar', 0, this.alt(this.app('escapeChar_hexEscape'), this.app('escapeChar_unicodeEscape'), this.app('escapeChar_escape')))
    .define('regExp', 0, this.seq(this.prim('/'), this.app('reCharClass'), this.prim('/')), 'a regular expression')
    .define('reCharClass_unicode', 0, this.seq(this.prim('\\p{'), this.many(this.prim(/[A-Za-z]/), 1), this.prim('}')))
    .define('reCharClass_ordinary', 0, this.seq(this.prim('['), this.many(this.alt(this.prim('\\]'), this.seq(this.not(this.prim(']')), this.app('_'))), 0), this.prim(']')))
    .define('reCharClass', 0, this.alt(this.app('reCharClass_unicode'), this.app('reCharClass_ordinary')))
    .define('number', 0, this.seq(this.opt(this.prim('-')), this.many(this.app('digit'), 1)), 'a number')
    .define('space_singleLine', 0, this.seq(this.prim('//'), this.many(this.seq(this.not(this.prim('\n')), this.app('_')), 0), this.prim('\n')))
    .define('space_multiLine', 0, this.seq(this.prim('/*'), this.many(this.seq(this.not(this.prim('*/')), this.app('_')), 0), this.prim('*/')))
    .extend('space', 0, this.alt(this.alt(this.app('space_singleLine'), this.app('space_multiLine')), this.prim(/[\s]/)), 'a space')
    .build();
});

