/**
 * @fileOverview 프로젝트 > 모듈 > 네임스페이스
 * @author AU개발랩
 */

/** @namespace */
typeof nhn === 'undefined' && (nhn = {});
/** @namespace */
nhn.mobile = nhn.mobile || {};
/** @namespace */
nhn.mobile.search = nhn.mobile.search || {};
/** @namespace */
nhn.mobile.search.matrix = nhn.mobile.search.matrix || {};

/**
 * @fileOverview 프로젝트 > 모듈 > 컨트롤러
 * @author AU개발랩
 */
nhn.mobile.search.matrix.Controller = $Class(/** @lends nhn.mobile.search.matrix.Controller.prototype */{

	/**
	 * nhn.mobile.search.matrix.Controller 클래스의 인스턴스를 생성한다.
	 *
	 * @class 모바일 > 컨트롤러
	 * @constructs
	 * @param {HashTable} [htGlobalConfig] 초기설정정보
	 * @example
	 * new nhn.mobile.search.matrix.Controller(htGlobalConfig);
	 */
	$init : function (htGlobalConfig) {
		// 컨트롤러 기본 옵션 설정
		var htDefaultConfig = {
			elBase: '._some_selector'
		};

		// 모듈 설정 정보 옵션 저장
		this.option(htDefaultConfig);
		this.option(htGlobalConfig, {});

		this.welBase = $Element(this.option('elBase'));

		// 샘플 코드이므로 삭제 후 개발하시면 됩니다.
		console.log('프로젝트가 초기화가 완료되었습니다.');
	}
}).extend(jindo.m.UIComponent);
