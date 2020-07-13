import os
for _dir in [
	_file.name
	for _file in os.scandir()
	if _file.is_dir() and _file.name[0] != '.'
]:
	with open(_dir+'/script.js') as script:
		script_source = script.read()[:-1]
		with open(_dir+'/wrapper.webextension.js') as wrapper_webextension:
			with open(_dir+'/script.webextension.js','w+') as script_webextension:
				script_webextension.write(
					wrapper_webextension.read().replace(
						'{{script.js}}',
						script_source
					)
				)
		with open(_dir+'/wrapper.greasyfork.js') as wrapper_greasyfork:
			with open(_dir+'/script.greasyfork.js','w+') as script_greasyfork:
				script_greasyfork.write(
					wrapper_greasyfork.read().replace(
						'{{script.js}}',
						script_source
					)
				)

