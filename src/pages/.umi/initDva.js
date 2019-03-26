import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/project/demo/myDemo/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/project/demo/myDemo/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/project/demo/myDemo/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/project/demo/myDemo/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('/project/demo/myDemo/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/project/demo/myDemo/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/project/demo/myDemo/src/models/user.js').default) });
