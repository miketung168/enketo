<?php

/**
 * Copyright 2012 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class Formlist extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->load->helper(array('url'));

		$default_scripts = array
		(
			'/libraries/jquery.min.js',
			'/libraries/bootstrap/js/bootstrap.min.js',
			'/libraries/modernizr.min.js'
		);

		$default_stylesheets = array
		(
			array( 'href' => '/css/styles.css', 'media' => 'screen')
		);

		$data = array(
			'offline'=>FALSE, 
			'title_component'=>'formlist', 
			'stylesheets' => $default_stylesheets
		);

		if (ENVIRONMENT === 'production')
		{
			$data['scripts'] = array_merge($default_scripts, array(
				'/js-min/formlist-all-min.js'
			));
		}
		else
		{
			$data['scripts'] = array_merge($default_scripts, array(
				'/js-source/__common.js',       
				'/js-source/__storage.js',
       			'/js-source/__connection.js',
       			'/js-source/__cache.js',
        		'/js-source/__formlist.js'
			));
		}

		$this->load->view('formlist_view', $data);
	}

	public function get_list()
	{
		$this->load->model('Form_model', '');
		extract($_GET);
		if (isset($server_url) && strlen($server_url) > 0)
		{
			$result = $this->Form_model->get_formlist_JSON($server_url);
			$this->output
				->set_content_type('applicaton/json')
				->set_output(json_encode($result)); 
		}
		else 
		{
			echo 'no server url received!';
		}
	}

}


?>