import os
for _dir in [
	_file.name
	for _file in os.scandir()
	if _file.is_dir() and _file.name[0] != '.'
]:
	with open(_dir+'/script.js') as script:
		with open(_dir+'/wrapper.webextension.js') as wrapper_webextension:
			with open(_dir+'/script.webextension.js','w+') as script_webextension:
				script_webextension.write(
					wrapper_webextension.replace(
						'{{script.js}}',
						script.read()
					)
				)
			with open(_dir+'/script.greasyfork.js','w+') as script_greasyfork:
				script_greasyfork.write(
					wrapper_greasyfork.replace(
						'{{script.js}}',
						script.read()
					)
				)

