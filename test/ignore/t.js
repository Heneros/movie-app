function longestCommonPrefix(strs) {
    var prefix = strs[0];
    for (var i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
        }
        if (prefix === '') {
            return prefix;
        }
    }
    return prefix;
}
console.log(longestCommonPrefix(['abc', 'abcqwet', 'abc', 'abc', 'abcqwe']));
