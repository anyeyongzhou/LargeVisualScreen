declare global {
	interface Window {
		_AMapSecurityConfig: {
			securityJsCode: string;
		};
	}
}

// yourModule.ts 文件

import "./global";
